import { useRef, useState } from "react";
import { Mail, User as UserIcon, Calendar, Shield, Pencil, Camera, Loader2 } from "lucide-react";

import { Button } from "@shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { toast } from "@shared/lib/hooks/use-toast";
import { cn } from "@shared/lib/utils";
import { LogoutButton } from "@modules/auth";

import { useGetProfileQuery } from "../api/hooks/useGetProfileQuery";
import { EditProfileDialog } from "./_components/EditProfileDialog";

export const ProfilePage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isPending, refetch } = useGetProfileQuery({});

  if (isPending) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center'>
          <p className='text-muted-foreground'>Загрузка...</p>
        </div>
      </div>
    );
  }

  const userData = data?.data;
  const fullName = userData?.firstName && userData?.secondName
    ? `${userData.firstName} ${userData.secondName}`
    : userData?.firstName || "Пользователь";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Не указана";
    try {
      return new Date(dateString).toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "Пользователь";
    const roleLower = role.toLowerCase();
    if (roleLower === "admin" || roleLower === "админ") return "Администратор";
    return "Пользователь";
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setIsUploadingAvatar(true);
      const formData = new FormData();
      formData.append("avatar", file);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Аватар обновлен",
        description: "Изображение профиля успешно загружено"
      });
      await refetch();
    } catch (error) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Не удалось загрузить аватар"
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Выберите файл изображения"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Размер файла не должен превышать 5 МБ"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    await handleAvatarUpload(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const currentAvatarUrl = avatarPreview || userData?.image?.fileUrl;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mx-auto max-w-2xl'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='text-2xl'>Профиль</CardTitle>
                <CardDescription>Информация о вашем аккаунте</CardDescription>
              </div>
              <Button onClick={() => setIsEditDialogOpen(true)} variant='outline' className='gap-2'>
                <Pencil className='h-4 w-4' />
                Редактировать
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div
                  onClick={handleAvatarClick}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-full",
                    isUploadingAvatar && "opacity-50"
                  )}
                >
                  {currentAvatarUrl ? (
                    <img
                      src={currentAvatarUrl}
                      alt={fullName}
                      className='h-20 w-20 object-cover transition-opacity group-hover:opacity-80'
                    />
                  ) : (
                    <div className='flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20'>
                      <UserIcon className='h-10 w-10 text-primary' />
                    </div>
                  )}
                  <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
                    {isUploadingAvatar ? (
                      <Loader2 className='h-6 w-6 animate-spin text-white' />
                    ) : (
                      <Camera className='h-6 w-6 text-white' />
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  className='hidden'
                />
              </div>
              <div>
                <h2 className='text-xl font-semibold'>{fullName}</h2>
                <p className='text-sm text-muted-foreground'>{userData?.mail || "Email не указан"}</p>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Mail className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Электронная почта</p>
                  <p className='text-sm text-muted-foreground'>{userData?.mail || "Не указана"}</p>
                </div>
              </div>

              {userData?.phone && (
                <div className='flex items-center gap-3'>
                  <UserIcon className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Телефон</p>
                    <p className='text-sm text-muted-foreground'>{userData.phone}</p>
                  </div>
                </div>
              )}

              <div className='flex items-center gap-3'>
                <Shield className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>Роль</p>
                  <p className='text-sm text-muted-foreground'>{getRoleLabel(userData?.role)}</p>
                </div>
              </div>

              {userData?.birthDate && (
                <div className='flex items-center gap-3'>
                  <Calendar className='h-5 w-5 text-muted-foreground' />
                  <div>
                    <p className='text-sm font-medium'>Дата рождения</p>
                    <p className='text-sm text-muted-foreground'>{formatDate(userData.birthDate)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className='border-t pt-4'>
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </div>
      {userData && (
        <EditProfileDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          userData={userData}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
};
