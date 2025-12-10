import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import type { UserResponse } from "../../api/requests/getUsers";
import type { UserFormData } from "../../types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse;
  formData: UserFormData;
  onFormChange: (data: UserFormData) => void;
  onSave: () => void;
  isLoading: boolean;
}

export const EditUserModal = ({
  isOpen,
  onClose,
  user,
  formData,
  onFormChange,
  onSave,
  isLoading
}: EditUserModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] backdrop-blur-sm' onClick={onClose}>
      <div className='bg-card text-card-foreground p-6 rounded-xl w-[500px] max-w-[90%] max-h-[90vh] overflow-y-auto border border-border shadow-xl' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between mb-5 text-xl font-bold'>
          <span>Редактирование пользователя: {user.fullName}</span>
          <Button variant='ghost' size='icon' onClick={onClose}>✕</Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
            <Label className='mb-1.5'>ФИО</Label>
            <Input
              type='text'
              value={formData.fullName}
              onChange={(e) => onFormChange({ ...formData, fullName: e.target.value })}
              required
            />
          </div>
          <div className='flex flex-col mb-4'>
            <Label className='mb-1.5'>Email (нельзя менять)</Label>
            <Input
              type='email'
              value={user.email}
              disabled
              className='bg-muted'
            />
          </div>
          <div className='flex flex-col'>
            <Label className='mb-1.5'>Роль</Label>
            <Input
              component='select'
              value={formData.role}
              onChange={(e) => onFormChange({ 
                ...formData, 
                role: e.target.value as "Пользователь" | "Администратор" 
              })}
            >
              <option value='Пользователь'>Пользователь</option>
              <option value='Администратор'>Администратор</option>
            </Input>
          </div>
          <div className='mt-5 flex justify-end gap-2.5'>
            <Button variant='outline' type='button' onClick={onClose} disabled={isLoading}>
              Отмена
            </Button>
            <Button variant='default' type='submit' disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};