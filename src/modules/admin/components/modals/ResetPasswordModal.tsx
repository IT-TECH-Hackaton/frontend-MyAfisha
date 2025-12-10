import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import type { UserResponse } from "../../api/requests/getUsers";
import type { PasswordFormData } from "../../types";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse;
  formData: PasswordFormData;
  onFormChange: (data: PasswordFormData) => void;
  onSave: () => void;
  isLoading: boolean;
}

export const ResetPasswordModal = ({
  isOpen,
  onClose,
  user,
  formData,
  onFormChange,
  onSave,
  isLoading
}: ResetPasswordModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] backdrop-blur-sm' onClick={onClose}>
      <div className='bg-card text-card-foreground p-6 rounded-xl w-[500px] max-w-[90%] max-h-[90vh] overflow-y-auto border border-border shadow-xl' onClick={(e) => e.stopPropagation()}>
        <div className='flex justify-between mb-5 text-xl font-bold'>
          <span>Сброс пароля для {user.fullName}</span>
          <Button variant='ghost' size='icon' onClick={onClose}>✕</Button>
        </div>
        <div>
          <p className='mb-4'>
            Подтвердите сброс пароля для <strong>{user.email}</strong>. После
            подтверждения администратор введет новый пароль, и он будет автоматически отправлен
            пользователю.
          </p>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col mb-4'>
              <Label className='mb-1.5'>Новый пароль</Label>
              <Input
                type='password'
                value={formData.password}
                onChange={(e) => onFormChange({ ...formData, password: e.target.value })}
                required
                minLength={8}
              />
            </div>
            <div className='flex flex-col mb-4'>
              <Label className='mb-1.5'>Повторите пароль</Label>
              <Input
                type='password'
                value={formData.confirmPassword}
                onChange={(e) => onFormChange({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={8}
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
                {isLoading ? "Отправка..." : "Сбросить и отправить"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};