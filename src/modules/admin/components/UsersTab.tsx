import { useState, useRef, useEffect } from "react";
import { Download, Loader2, ChevronDown, Users, Shield, User } from "lucide-react";
import { useToast } from "@shared/lib/hooks/use-toast";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { UsersTable } from "./tables/UsersTable";
import { EditUserModal } from "./modals/EditUserModal";
import { ResetPasswordModal } from "./modals/ResetPasswordModal";

import { useGetUsersQuery } from "../api/hooks/useGetUsersQuery";
import { useUpdateUserMutation } from "../api/hooks/useUpdateUserMutation";
import { useDeleteUserMutation } from "../api/hooks/useDeleteUserMutation";
import { useResetUserPasswordMutation } from "../api/hooks/useResetUserPasswordMutation";
import { useExportUsersMutation } from "../api/hooks/useExportUsersMutation";

import type { UserResponse } from "../api/requests/getUsers";
import type { UserFilters, UserFormData, PasswordFormData } from "../types";

export const UsersTab = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<UserFilters>({
    fullName: "",
    role: "",
    status: "Активен",
    dateFrom: "",
    dateTo: ""
  });
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit] = useState(10);
  
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  
  const [userForm, setUserForm] = useState<UserFormData>({
    fullName: "",
    role: "Пользователь"
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    password: "",
    confirmPassword: ""
  });
  
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Запросы пользователей
  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetUsersQuery({
    params: {
      page: usersPage,
      limit: usersLimit,
      fullName: filters.fullName || undefined,
      role: (filters.role as "Пользователь" | "Администратор") || undefined,
      status: (filters.status as "Активен" | "Удален") || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined
    },
    options: { refetchOnWindowFocus: false }
  });

  const users = usersData?.data?.data || [];
  const usersPagination = usersData?.data?.pagination;

  // Мутации пользователей
  const updateUserMutation = useUpdateUserMutation({
    options: {
      onSuccess: () => {
        toast({ title: "Пользователь обновлен", description: "Изменения успешно сохранены" });
        refetchUsers();
        setEditUserModalOpen(false);
        setCurrentUser(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось обновить пользователя";
        toast({ className: "bg-red-800 text-white hover:bg-red-700", title: "Ошибка", description: errorMessage });
      }
    }
  });

  const deleteUserMutation = useDeleteUserMutation({
    options: {
      onSuccess: () => {
        toast({ title: "Пользователь удален", description: "Пользователь помечен как удаленный" });
        refetchUsers();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось удалить пользователя";
        toast({ className: "bg-red-800 text-white hover:bg-red-700", title: "Ошибка", description: errorMessage });
      }
    }
  });

  const exportUsersMutation = useExportUsersMutation({
    options: {
      onSuccess: async (response) => {
        try {
          const blob = response.data;
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const fileName = `users_${new Date().toISOString().split("T")[0]}.xlsx`;
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          toast({ title: "Экспорт выполнен", description: "Список пользователей успешно скачан" });
        } catch (error) {
          toast({ className: "bg-red-800 text-white hover:bg-red-700", title: "Ошибка", description: "Не удалось скачать файл" });
        }
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось экспортировать пользователей";
        toast({ className: "bg-red-800 text-white hover:bg-red-700", title: "Ошибка", description: errorMessage });
      }
    }
  });

  const resetPasswordMutation = useResetUserPasswordMutation({
    options: {
      onSuccess: () => {
        toast({ title: "Пароль сброшен", description: "Новый пароль отправлен на почту пользователя" });
        setResetPasswordModalOpen(false);
        setCurrentUser(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось сбросить пароль";
        toast({ className: "bg-red-800 text-white hover:bg-red-700", title: "Ошибка", description: errorMessage });
      }
    }
  });

  // Обработчики
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setUsersPage(1);
  };

  const handleDeleteUser = (user: UserResponse) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя (мягкое удаление)?`)) {
      deleteUserMutation.mutate({ params: { id: user.id } });
    }
  };

  const handleOpenEditUserModal = (user: UserResponse) => {
    setCurrentUser(user);
    setUserForm({ fullName: user.fullName, role: user.role });
    setEditUserModalOpen(true);
  };

  const handleOpenResetPasswordModal = (user: UserResponse) => {
    setCurrentUser(user);
    setPasswordForm({ password: "", confirmPassword: "" });
    setResetPasswordModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!currentUser) return;
    updateUserMutation.mutate({
      params: { id: currentUser.id, fullName: userForm.fullName, role: userForm.role }
    });
  };

  const handleConfirmResetPassword = () => {
    if (!currentUser) return;
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast({ className: "bg-red-800 text-white hover:bg-red-700", title: "Ошибка", description: "Пароли не совпадают" });
      return;
    }
    resetPasswordMutation.mutate({ params: { id: currentUser.id, password: passwordForm.password } });
  };

  const handleExport = (role?: "Пользователь" | "Администратор") => {
    exportUsersMutation.mutate({
      params: {
        format: "xlsx",
        fullName: filters.fullName || undefined,
        role: role || filters.role || undefined,
        status: filters.status || undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined
      }
    });
    setExportMenuOpen(false);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    };

    if (exportMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [exportMenuOpen]);

  return (
    <div className='section-users'>
      <div className='flex justify-between items-center mb-5'>
        <h1>Управление пользователями</h1>
        <div className='relative' ref={exportMenuRef}>
          <Button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            disabled={exportUsersMutation.isPending}
            className='bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-medium px-6 py-2.5 rounded-lg flex items-center gap-2'
          >
            {exportUsersMutation.isPending ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Экспорт...
              </>
            ) : (
              <>
                <Download className='h-4 w-4' />
                Экспорт в XLSX
                <ChevronDown className='h-4 w-4' />
              </>
            )}
          </Button>
          {exportMenuOpen && !exportUsersMutation.isPending && (
            <div className='absolute right-0 mt-2 w-64 bg-popover rounded-lg shadow-xl border border-border z-50 overflow-hidden'>
              <div className='py-1'>
                <Button
                  variant='ghost'
                  className='w-full justify-start px-4 py-2.5 text-sm'
                  onClick={() => handleExport()}
                >
                  <Users className='h-4 w-4 mr-2 text-muted-foreground' />
                  <span>Все пользователи</span>
                  <span className='ml-auto text-xs text-muted-foreground'>
                    {filters.role ? `(фильтр: ${filters.role})` : ""}
                  </span>
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start px-4 py-2.5 text-sm border-t border-border'
                  onClick={() => handleExport("Администратор")}
                >
                  <Shield className='h-4 w-4 mr-2 text-blue-600 dark:text-blue-400' />
                  <span>Только администраторы</span>
                </Button>
                <Button
                  variant='ghost'
                  className='w-full justify-start px-4 py-2.5 text-sm border-t border-border'
                  onClick={() => handleExport("Пользователь")}
                >
                  <User className='h-4 w-4 mr-2 text-green-600 dark:text-green-400' />
                  <span>Только пользователи</span>
                </Button>
              </div>
              <div className='border-t border-border px-4 py-2 bg-muted/50'>
                <p className='text-xs text-muted-foreground'>
                  Применяются текущие фильтры (статус, даты, ФИО)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className='bg-card text-card-foreground p-4 rounded-xl shadow-sm border border-border mb-5 flex gap-4 flex-wrap'>
        <div className='flex flex-col'>
          <Label className='mb-1.5'>ФИО</Label>
          <Input
            type='text'
            placeholder='Поиск...'
            name='fullName'
            value={filters.fullName}
            onChange={handleFilterChange}
          />
        </div>
        <div className='flex flex-col'>
          <Label className='mb-1.5'>Роль</Label>
          <Input
            component='select'
            name='role'
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value=''>Все</option>
            <option value='Администратор'>Администратор</option>
            <option value='Пользователь'>Пользователь</option>
          </Input>
        </div>
        <div className='flex flex-col'>
          <Label className='mb-1.5'>Статус</Label>
          <Input
            component='select'
            name='status'
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value=''>Все</option>
            <option value='Активен'>Активен</option>
            <option value='Удален'>Удален</option>
          </Input>
        </div>
        <div className='flex flex-col'>
          <Label className='mb-1.5'>Дата регистрации (с - по)</Label>
          <div className='flex gap-1.25'>
            <Input
              type='date'
              name='dateFrom'
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
            <Input
              type='date'
              name='dateTo'
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      <div className='bg-card text-card-foreground rounded-xl shadow-sm overflow-hidden border border-border'>
        <table className='w-full border-collapse'>
          <thead>
            <tr>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>ФИО</th>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>Email</th>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>Роль</th>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>Дата рег.</th>
              <th className='px-4 py-3 text-left border-b border-border bg-muted/70 font-semibold text-muted-foreground'>Статус</th>
              <th className='px-4 py-3 text-right border-b border-border bg-muted/70 font-semibold text-muted-foreground'>Действия</th>
            </tr>
          </thead>
          <tbody>
            <UsersTable
              users={users}
              isLoading={isLoadingUsers}
              onEditUser={handleOpenEditUserModal}
              onResetPassword={handleOpenResetPasswordModal}
              onDeleteUser={handleDeleteUser}
            />
          </tbody>
        </table>
      </div>

      {usersPagination && usersPagination.totalPages > 1 && (
        <div className='flex items-center gap-4 p-4 bg-card rounded-lg border border-border mt-5 justify-center'>
          <Button
            variant='outline'
            onClick={() => setUsersPage(Math.max(1, usersPage - 1))}
            disabled={usersPage === 1 || isLoadingUsers}
          >
            Назад
          </Button>
          <span className='px-4'>
            Страница {usersPagination.page} из {usersPagination.totalPages} (Всего: {usersPagination.total})
          </span>
          <Button
            variant='outline'
            onClick={() => setUsersPage(Math.min(usersPagination.totalPages, usersPage + 1))}
            disabled={usersPage === usersPagination.totalPages || isLoadingUsers}
          >
            Вперед
          </Button>
        </div>
      )}
      
      {currentUser && (
        <>
          <EditUserModal
            isOpen={isEditUserModalOpen}
            onClose={() => {
              setEditUserModalOpen(false);
              setCurrentUser(null);
            }}
            user={currentUser}
            formData={userForm}
            onFormChange={setUserForm}
            onSave={handleSaveUser}
            isLoading={updateUserMutation.isPending}
          />

          <ResetPasswordModal
            isOpen={isResetPasswordModalOpen}
            onClose={() => {
              setResetPasswordModalOpen(false);
              setCurrentUser(null);
            }}
            user={currentUser}
            formData={passwordForm}
            onFormChange={setPasswordForm}
            onSave={handleConfirmResetPassword}
            isLoading={resetPasswordMutation.isPending}
          />
        </>
      )}
    </div>
  );
};