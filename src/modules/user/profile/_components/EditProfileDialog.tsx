import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Camera, Loader2 } from "lucide-react";
import { z } from "zod";

import { toast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@shared/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { cn } from "@shared/lib/utils";

import type { UserData } from "../../types";

const editProfileSchema = z.object({
  firstName: z.string().min(1, { message: "Имя обязательно для заполнения" }),
  secondName: z.string().min(1, { message: "Фамилия обязательна для заполнения" }),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  avatar: z.instanceof(File).optional()
});

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserData;
  onSuccess?: () => void;
}

export const EditProfileDialog = ({
  open,
  onOpenChange,
  userData,
  onSuccess
}: EditProfileDialogProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userData.image?.fileUrl || null
  );
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: userData.firstName || "",
      secondName: userData.secondName || "",
      phone: userData.phone || "",
      birthDate: userData.birthDate || ""
    }
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    form.setValue("avatar", file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
    try {
      setIsUploadingAvatar(!!values.avatar);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Профиль обновлен",
        description: "Изменения успешно сохранены"
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Не удалось обновить профиль"
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          <DialogDescription>Внесите изменения в информацию о себе</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex justify-center'>
              <div className='relative'>
                <div
                  onClick={handleAvatarClick}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-full",
                    isUploadingAvatar && "opacity-50"
                  )}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt='Аватар'
                      className='h-24 w-24 object-cover transition-opacity group-hover:opacity-80'
                    />
                  ) : (
                    <div className='flex h-24 w-24 items-center justify-center bg-primary/10 transition-colors group-hover:bg-primary/20'>
                      <Camera className='h-12 w-12 text-primary' />
                    </div>
                  )}
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
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
            </div>
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите имя' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='secondName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите фамилию' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите телефон' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='birthDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата рождения</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type='submit'>Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

