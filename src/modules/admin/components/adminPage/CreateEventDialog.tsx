import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useCreateEventMutation } from "@modules/events/api/hooks/useCreateEventMutation";
import { useUploadImageMutation } from "@shared/api/hooks/useUploadImageMutation";
import { useGetCategoriesQuery } from "@modules/categories/api/hooks/useGetCategoriesQuery";
import { YandexMapPicker } from "@shared/ui/yandex-map-picker";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@shared/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";
import { useToast } from "@shared/lib/hooks/use-toast";

const createEventSchema = z.object({
  title: z.string().min(1, "Название обязательно").max(200, "Максимум 200 символов"),
  shortDescription: z.string().max(500, "Максимум 500 символов").optional(),
  fullDescription: z.string().min(1, "Полное описание обязательно").max(5000, "Максимум 5000 символов"),
  startDate: z.string().min(1, "Дата начала обязательна"),
  startTime: z.string().min(1, "Время начала обязательно"),
  endDate: z.string().min(1, "Дата окончания обязательна"),
  endTime: z.string().min(1, "Время окончания обязательно"),
  imageFile: z.instanceof(File, { message: "Изображение обязательно" }).optional(),
  paymentInfo: z.string().max(1000, "Максимум 1000 символов").optional(),
  maxParticipants: z.coerce.number().int().positive("Должно быть положительным числом").optional(),
  address: z.string().max(500, "Максимум 500 символов").optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  yandexMapLink: z.string().max(1000, "Максимум 1000 символов").optional()
}).refine((data) => {
  if (data.startDate && data.startTime && data.endDate && data.endTime) {
    const start = new Date(`${data.startDate}T${data.startTime}`);
    const end = new Date(`${data.endDate}T${data.endTime}`);
    return end > start;
  }
  return true;
}, {
  message: "Дата и время окончания должны быть позже даты и времени начала",
  path: ["endDate"]
}).refine((data) => {
  if (data.startDate && data.startTime) {
    const start = new Date(`${data.startDate}T${data.startTime}`);
    return start > new Date();
  }
  return true;
}, {
  message: "Дата и время начала должны быть в будущем",
  path: ["startDate"]
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreateEventDialog = ({ open, onOpenChange, onSuccess }: CreateEventDialogProps) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const uploadImageMutation = useUploadImageMutation();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategoriesQuery({
    options: { enabled: open }
  });
  const createEventMutation = useCreateEventMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Событие создано",
          description: "Событие успешно добавлено в систему"
        });
        form.reset();
        setImagePreview(null);
        setSelectedCategories([]);
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось создать событие";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const form = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      fullDescription: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      paymentInfo: "",
      maxParticipants: undefined,
      address: "",
      latitude: undefined,
      longitude: undefined,
      yandexMapLink: ""
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Выберите файл изображения"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Размер файла не должен превышать 10 МБ"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    form.setValue("imageFile", file);
  };

  const handleLocationSelect = (coordinates: { lat: number; lon: number }, address?: string) => {
    form.setValue("latitude", coordinates.lat);
    form.setValue("longitude", coordinates.lon);
    form.setValue("address", address || "");
  };

  const onSubmit = async (values: CreateEventFormValues) => {
    try {
      if (!values.imageFile) {
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: "Изображение обязательно для создания события"
        });
        return;
      }

      const uploadResult = await uploadImageMutation.mutateAsync({
        params: { file: values.imageFile }
      });
      
      if (!uploadResult.data.url) {
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: "Не удалось загрузить изображение"
        });
        return;
      }

      const imageURL = uploadResult.data.url;

      const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
      const endDateTime = new Date(`${values.endDate}T${values.endTime}`);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: "Неверный формат даты или времени"
        });
        return;
      }

      const startDateISO = startDateTime.toISOString();
      const endDateISO = endDateTime.toISOString();

      await createEventMutation.mutateAsync({
        params: {
          title: values.title,
          shortDescription: values.shortDescription || undefined,
          fullDescription: values.fullDescription,
          startDate: startDateISO,
          endDate: endDateISO,
          imageURL,
          paymentInfo: values.paymentInfo || undefined,
          maxParticipants: values.maxParticipants,
          categoryIDs: selectedCategories.length > 0 ? selectedCategories : undefined,
          address: values.address || undefined,
          latitude: values.latitude,
          longitude: values.longitude,
          yandexMapLink: values.yandexMapLink || undefined
        }
      });
    } catch (error: any) {
      console.error("Error creating event:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Не удалось создать событие";
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: errorMessage
      });
    }
  };

  const isLoading = uploadImageMutation.isPending || createEventMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Создание события</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового события. Поля, отмеченные *, обязательны для заполнения.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название события *</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите название события' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='shortDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Краткое описание</FormLabel>
                  <FormControl>
                    <Input placeholder='Краткое описание для карточки события' {...field} />
                  </FormControl>
                  <FormDescription>Будет отображаться в карточке события</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='fullDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное описание *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Подробное описание события'
                      rows={4}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='startDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дата начала *</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='startTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Время начала *</FormLabel>
                      <FormControl>
                        <Input type='time' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='endDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дата окончания *</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='endTime'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Время окончания *</FormLabel>
                      <FormControl>
                        <Input type='time' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name='imageFile'
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Изображение *</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={(e) => {
                          handleImageChange(e);
                          onChange(e.target.files?.[0]);
                        }}
                        {...field}
                      />
                      {imagePreview && (
                        <div className='relative w-full h-48 rounded-md overflow-hidden border'>
                          <img
                            src={imagePreview}
                            alt='Предпросмотр'
                            className='w-full h-full object-cover'
                          />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>Максимальный размер файла: 10 МБ</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='paymentInfo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Информация об оплате</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Реквизиты, сумма, способ оплаты...'
                      rows={3}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='maxParticipants'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Максимальное количество участников</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Не указано'
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormDescription>Оставьте пустым, если лимит не установлен</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Категории</FormLabel>
              {isLoadingCategories ? (
                <div className='text-sm text-muted-foreground'>Загрузка категорий...</div>
              ) : (
                <div className='flex flex-wrap gap-2'>
                  {categoriesData?.data?.data?.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    return (
                      <Badge
                        key={category.id}
                        variant={isSelected ? "selected" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedCategories((prev) => prev.filter((id) => id !== category.id));
                          } else {
                            setSelectedCategories((prev) => [...prev, category.id]);
                          }
                        }}
                      >
                        {category.name}
                      </Badge>
                    );
                  })}
                  {(!categoriesData?.data?.data || categoriesData.data.data.length === 0) && (
                    <div className='text-sm text-muted-foreground'>Категории не найдены</div>
                  )}
                </div>
              )}
              <FormDescription>Выберите категории для события</FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Место проведения</FormLabel>
                  <FormControl>
                    <div className='space-y-2'>
                      <YandexMapPicker
                        onLocationSelect={handleLocationSelect}
                        initialCoordinates={
                          form.watch("latitude") && form.watch("longitude")
                            ? { lat: form.watch("latitude")!, lon: form.watch("longitude")! }
                            : undefined
                        }
                      />
                      <Input
                        placeholder='Адрес будет заполнен автоматически при выборе на карте'
                        {...field}
                        readOnly
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Кликните на карте, чтобы выбрать место проведения</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  form.reset();
                  setImagePreview(null);
                  onOpenChange(false);
                }}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Создать событие
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

