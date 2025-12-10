import { Button } from "@shared/ui/button";
import { cn } from "@shared/lib/utils";
import type { UserResponse } from "../../api/requests/getUsers";
import { UsersTableSkeleton } from "./UsersTableSkeleton";

interface UsersTableProps {
  users: UserResponse[];
  isLoading: boolean;
  onEditUser: (user: UserResponse) => void;
  onResetPassword: (user: UserResponse) => void;
  onDeleteUser: (user: UserResponse) => void;
}

export const UsersTable = ({
  users,
  isLoading,
  onEditUser,
  onResetPassword,
  onDeleteUser
}: UsersTableProps) => {
  if (isLoading) {
    return <UsersTableSkeleton />;
  }

  if (users.length === 0) {
    return (
      <tr>
        <td colSpan={6} className='text-center p-5'>
          Пользователи не найдены
        </td>
      </tr>
    );
  }

  return users.map((user) => (
    <tr key={user.id} className={cn("hover:bg-muted/35", user.status === "Удален" && "opacity-60")}>
      <td className='px-4 py-3 text-left border-b border-border'>{user.fullName}</td>
      <td className='px-4 py-3 text-left border-b border-border'>{user.email}</td>
      <td className='px-4 py-3 text-left border-b border-border'>
        <span
          className={cn(
            "px-2 py-1 rounded-xl text-xs font-bold",
            user.role === "Администратор"
              ? "bg-primary/16 text-primary"
              : "bg-muted/80 text-muted-foreground"
          )}
        >
          {user.role}
        </span>
      </td>
      <td className='px-4 py-3 text-left border-b border-border'>
        {new Date(user.createdAt).toLocaleDateString("ru-RU")}
      </td>
      <td className='px-4 py-3 text-left border-b border-border'>
        <span
          className={cn(
            "px-2 py-1 rounded-xl text-xs font-bold",
            user.status === "Активен"
              ? "bg-chart-2/20 text-chart-2"
              : "bg-destructive/18 text-destructive"
          )}
        >
          {user.status}
        </span>
      </td>
      <td className='px-4 py-3 text-right border-b border-border whitespace-nowrap'>
        <Button
          variant='default'
          size='sm'
          className='mr-2'
          onClick={() => onEditUser(user)}
        >
          Редактировать
        </Button>
        <Button
          variant='outline'
          size='sm'
          className='mr-2'
          onClick={() => onResetPassword(user)}
        >
          Сбросить пароль
        </Button>
        {user.status === "Активен" ? (
          <Button
            variant='destructive'
            size='sm'
            onClick={() => onDeleteUser(user)}
          >
            Удалить
          </Button>
        ) : (
          <Button
            variant='outline'
            size='sm'
            disabled
            title='Пользователь уже удален'
          >
            Удален
          </Button>
        )}
      </td>
    </tr>
  ));
};