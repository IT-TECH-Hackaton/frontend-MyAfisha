import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import type { Category } from "@modules/categories/api/requests/getCategories";
import type { CategoryFormData } from "../../types";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  formData: CategoryFormData;
  onFormChange: (data: CategoryFormData) => void;
  onSave: () => void;
  isLoading: boolean;
}

export const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  formData,
  onFormChange,
  onSave,
  isLoading
}: EditCategoryModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] backdrop-blur-sm' onClick={onClose}>
      <div className='bg-card text-card-foreground p-6 rounded-xl w-[500px] max-w-[90%] max-h-[90vh] overflow-y-auto border border-border shadow-xl' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between mb-5 text-xl font-bold'>
          <span>Редактирование категории: {category.name}</span>
          <Button variant='ghost' size='icon' onClick={onClose}>✕</Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
            <Label className='mb-1.5'>Название *</Label>
            <Input
              type='text'
              value={formData.name}
              onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className='flex flex-col mb-4'>
            <Label className='mb-1.5'>Описание</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
            />
          </div>
          <div className='mt-5 flex justify-end gap-2.5'>
            <Button
              variant='outline'
              type='button'
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              variant='default'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};