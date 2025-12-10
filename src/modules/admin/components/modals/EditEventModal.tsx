import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";
import type { AdminEventResponse } from "../../api/requests/getAdminEvents";
import type { Category } from "@modules/categories/api/requests/getCategories";
import type { EventFormData } from "../../types";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: AdminEventResponse;
  formData: EventFormData;
  onFormChange: (name: string, value: any) => void;
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  categories: Category[];
  isLoadingCategories: boolean;
  onSave: () => void;
  isSaving: boolean;
}

export const EditEventModal = ({
  isOpen,
  onClose,
  event,
  formData,
  onFormChange,
  selectedCategories,
  onCategoryToggle,
  categories,
  isLoadingCategories,
  onSave,
  isSaving
}: EditEventModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFormChange(name, name === "maxParticipants" ? (value ? Number(value) : undefined) : value);
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] backdrop-blur-sm' onClick={onClose}>
      <div className='bg-card text-card-foreground p-6 rounded-xl w-[500px] max-w-[90%] max-h-[90vh] overflow-y-auto border border-border shadow-xl' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between mb-5 text-xl font-bold'>
          <span>Редактирование события: {event.title}</span>
          <Button variant='ghost' size='icon' onClick={onClose}>✕</Button>
        </div>
        <div>
          <form className='grid grid-cols-2 gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col col-span-2'>
              <Label className='mb-1.5'>Название *</Label>
              <Input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='flex flex-col'>
              <Label className='mb-1.5'>Начало *</Label>
              <Input
                type='date'
                name='startDate'
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='flex flex-col'>
              <Label className='mb-1.5'>Конец *</Label>
              <Input
                type='date'
                name='endDate'
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='flex flex-col col-span-2'>
              <Label className='mb-1.5'>Краткое описание</Label>
              <Input
                type='text'
                name='shortDescription'
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder='Краткое описание для карточки события'
              />
            </div>
            <div className='flex flex-col col-span-2'>
              <Label className='mb-1.5'>Полное описание *</Label>
              <Textarea
                name='fullDescription'
                value={formData.fullDescription}
                onChange={handleInputChange}
                rows={4}
                required
                placeholder='Подробное описание события'
              />
            </div>
            <div className='flex flex-col'>
              <Label className='mb-1.5'>Максимальное количество участников</Label>
              <Input
                type='number'
                name='maxParticipants'
                value={formData.maxParticipants || ""}
                onChange={handleInputChange}
                min={1}
                placeholder='Не указано'
              />
            </div>
            <div className='flex flex-col'>
              <Label className='mb-1.5'>Статус</Label>
              <Input
                component='select'
                name='status'
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value='Активное'>Активное</option>
                <option value='Прошедшее'>Прошедшее</option>
                <option value='Отклоненное'>Отклоненное</option>
              </Input>
            </div>
            <div className='flex flex-col col-span-2'>
              <Label className='mb-1.5'>Информация об оплате</Label>
              <Textarea
                name='paymentInfo'
                value={formData.paymentInfo}
                onChange={handleInputChange}
                rows={3}
                placeholder='Реквизиты, сумма, способ оплаты...'
              />
            </div>
            <div className='flex flex-col col-span-2'>
              <Label className='mb-1.5'>Категории</Label>
              {isLoadingCategories ? (
                <div className='p-2.5 text-muted-foreground'>Загрузка категорий...</div>
              ) : (
                <div className='flex flex-wrap gap-2 p-2.5 border border-border rounded-md min-h-[50px]'>
                  {categories.map((category) => {
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
                        onClick={() => onCategoryToggle(category.id)}
                      >
                        {category.name}
                      </Badge>
                    );
                  })}
                  {categories.length === 0 && (
                    <div className='text-muted-foreground'>Категории не найдены</div>
                  )}
                </div>
              )}
            </div>
            <div className='mt-5 flex justify-end gap-2.5 col-span-2'>
              <Button
                variant='outline'
                type='button'
                onClick={onClose}
                disabled={isSaving}
              >
                Отмена
              </Button>
              <Button
                variant='default'
                type='submit'
                disabled={isSaving}
              >
                {isSaving ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};