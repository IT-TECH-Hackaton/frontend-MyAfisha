import { useEffect, useState } from "react";

import { CreateEventDialog } from "./CreateEventDialog";
import { useGetUsersQuery } from "../../api/hooks/useGetUsersQuery";
import { useGetAdminEventsQuery } from "../../api/hooks/useGetAdminEventsQuery";
import { useUpdateUserMutation } from "../../api/hooks/useUpdateUserMutation";
import { useDeleteUserMutation } from "../../api/hooks/useDeleteUserMutation";
import { useResetUserPasswordMutation } from "../../api/hooks/useResetUserPasswordMutation";
import { useUpdateEventMutation } from "@modules/events/api/hooks/useUpdateEventMutation";
import { useDeleteEventMutation } from "@modules/events/api/hooks/useDeleteEventMutation";
import { useGetCategoriesQuery } from "@modules/categories/api/hooks/useGetCategoriesQuery";
import { useCreateCategoryMutation } from "@modules/categories/api/hooks/useCreateCategoryMutation";
import { useUpdateCategoryMutation } from "@modules/categories/api/hooks/useUpdateCategoryMutation";
import { useDeleteCategoryMutation } from "@modules/categories/api/hooks/useDeleteCategoryMutation";
import type { UserResponse } from "../../api/requests/getUsers";
import type { AdminEventResponse } from "../../api/requests/getAdminEvents";
import type { Category } from "@modules/categories/api/requests/getCategories";
import { useToast } from "@shared/lib/hooks/use-toast";
import { Badge } from "@shared/ui/badge";
import { cn } from "@shared/lib/utils";

import "./AdminPage.css";

interface UserFilters {
  fullName: string;
  role: "Пользователь" | "Администратор" | "";
  status: "Активен" | "Удален" | "";
  dateFrom: string;
  dateTo: string;
}

function AdminPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"users" | "events" | "categories">("users");
  const [filters, setFilters] = useState<UserFilters>({
    fullName: "",
    role: "",
    status: "Активен",
    dateFrom: "",
    dateTo: ""
  });
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit] = useState(10);

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
    options: {
      refetchOnWindowFocus: false
    }
  });

  const usersPagination = usersData?.data?.pagination;


  const updateUserMutation = useUpdateUserMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Пользователь обновлен",
          description: "Изменения успешно сохранены"
        });
        refetchUsers();
        setEditUserModalOpen(false);
        setCurrentUser(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось обновить пользователя";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const deleteUserMutation = useDeleteUserMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Пользователь удален",
          description: "Пользователь помечен как удаленный"
        });
        refetchUsers();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось удалить пользователя";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const resetPasswordMutation = useResetUserPasswordMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Пароль сброшен",
          description: "Новый пароль отправлен на почту пользователя"
        });
        setResetPasswordModalOpen(false);
        setCurrentUser(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось сбросить пароль";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const updateEventMutation = useUpdateEventMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Событие обновлено",
          description: "Изменения успешно сохранены"
        });
        refetchEvents();
        setEditEventModalOpen(false);
        setCurrentEvent(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось обновить событие";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const deleteEventMutation = useDeleteEventMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Событие удалено",
          description: "Событие успешно удалено из системы"
        });
        refetchEvents();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось удалить событие";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const users = usersData?.data?.data || [];

  const [eventStatusFilter, setEventStatusFilter] = useState<"Активное" | "Прошедшее" | "Отклоненное" | "">("");

  const { data: eventsData, isLoading: isLoadingEvents, refetch: refetchEvents } = useGetAdminEventsQuery({
    params: {
      status: eventStatusFilter || undefined
    },
    options: {
      refetchOnWindowFocus: false
    }
  });

  const events = eventsData?.data || [];

  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [isEditEventModalOpen, setEditEventModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [currentEvent, setCurrentEvent] = useState<AdminEventResponse | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    participantsCount: 0,
    location: null as { lat: number; lon: number; address?: string } | null
  });
  const [userForm, setUserForm] = useState({
    fullName: "",
    role: "Пользователь" as "Пользователь" | "Администратор"
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: ""
  });
  const [selectedEventCategories, setSelectedEventCategories] = useState<string[]>([]);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  const { data: categoriesData, isLoading: isLoadingCategories, refetch: refetchCategories } = useGetCategoriesQuery({
    options: { refetchOnWindowFocus: false }
  });

  const categories = categoriesData?.data?.data || [];

  const createCategoryMutation = useCreateCategoryMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Категория создана",
          description: "Категория успешно добавлена"
        });
        refetchCategories();
        setCategoryModalOpen(false);
        setCategoryForm({ name: "", description: "" });
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось создать категорию";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const updateCategoryMutation = useUpdateCategoryMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Категория обновлена",
          description: "Изменения успешно сохранены"
        });
        refetchCategories();
        setEditCategoryModalOpen(false);
        setCurrentCategory(null);
        setCategoryForm({ name: "", description: "" });
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось обновить категорию";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  const deleteCategoryMutation = useDeleteCategoryMutation({
    options: {
      onSuccess: () => {
        toast({
          title: "Категория удалена",
          description: "Категория успешно удалена"
        });
        refetchCategories();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Не удалось удалить категорию";
        toast({
          className: "bg-red-800 text-white hover:bg-red-700",
          title: "Ошибка",
          description: errorMessage
        });
      }
    }
  });

  useEffect(() => {
    if (currentEvent && activeTab === "events") {
      setSelectedEventCategories(currentEvent.categoryIDs || []);
    }
  }, [currentEvent, activeTab]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
    setUsersPage(1);
  };

  const handleDelete = (userId: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя (мягкое удаление)?`)) {
      deleteUserMutation.mutate({ params: { id: userId } });
    }
  };

  const handleOpenEditModal = (user: UserResponse) => {
    setCurrentUser(user);
    setUserForm({
      fullName: user.fullName,
      role: user.role
    });
    setEditUserModalOpen(true);
  };

  const handleOpenResetPasswordModal = (user: UserResponse) => {
    setCurrentUser(user);
    setPasswordForm({ password: "", confirmPassword: "" });
    setResetPasswordModalOpen(true);
  };


  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({
      ...prev,
      [name]: name === "participantsCount" ? Number(value) : value
    }));
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;

    if (eventForm.endDate && eventForm.startDate && eventForm.endDate < eventForm.startDate) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Дата окончания должна быть позже даты начала"
      });
      return;
    }

    const updateData: any = {
      title: eventForm.title,
      maxParticipants: eventForm.participantsCount || undefined
    };

    if (eventForm.startDate) {
      const startDateTime = new Date(eventForm.startDate);
      startDateTime.setHours(12, 0, 0, 0);
      updateData.startDate = startDateTime.toISOString();
    }

    if (eventForm.endDate) {
      const endDateTime = new Date(eventForm.endDate);
      endDateTime.setHours(23, 59, 59, 999);
      updateData.endDate = endDateTime.toISOString();
    }

    if (eventForm.location) {
      updateData.latitude = eventForm.location.lat;
      updateData.longitude = eventForm.location.lon;
      updateData.address = eventForm.location.address;
    }

    if (selectedEventCategories.length > 0) {
      updateData.categoryIDs = selectedEventCategories;
    }

    updateEventMutation.mutate({
      params: {
        id: currentEvent.id,
        ...updateData
      }
    });
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    updateUserMutation.mutate({
      params: {
        id: currentUser.id,
        fullName: userForm.fullName,
        role: userForm.role
      }
    });
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast({
        className: "bg-red-800 text-white hover:bg-red-700",
        title: "Ошибка",
        description: "Пароли не совпадают"
      });
      return;
    }
    resetPasswordMutation.mutate({
      params: {
        id: currentUser.id,
        password: passwordForm.password
      }
    });
  };

  const filteredUsers = users;

  return (
    <div className='admin-container'>
      <aside className='sidebar'>
        <h2>Admin Panel</h2>
        <nav>
          <div
            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Управление пользователями
          </div>
          <div
            className={`nav-item ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            📅 Управление событиями
          </div>
          <div
            className={`nav-item ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            🏷️ Управление категориями
          </div>
        </nav>
      </aside>
      <main className='main-content'>
        {activeTab === "users" && (
          <div className='section-users'>
            <h1>Управление пользователями</h1>
            <div className='filters-panel'>
              <div className='form-group'>
                <label>ФИО</label>
                <input
                  type='text'
                  className='form-input'
                  placeholder='Поиск...'
                  name='fullName'
                  value={filters.fullName}
                  onChange={handleFilterChange}
                />
              </div>
              <div className='form-group'>
                <label>Роль</label>
                <select
                  className='form-select'
                  name='role'
                  value={filters.role}
                  onChange={handleFilterChange}
                >
                  <option value=''>Все</option>
                  <option value='Администратор'>Администратор</option>
                  <option value='Пользователь'>Пользователь</option>
                </select>
              </div>
              <div className='form-group'>
                <label>Статус</label>
                <select
                  className='form-select'
                  name='status'
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value=''>Все</option>
                  <option value='Активен'>Активен</option>
                  <option value='Удален'>Удален</option>
                </select>
              </div>
              <div className='form-group'>
                <label>Дата регистрации (с - по)</label>
                <div style={{ display: "flex", gap: "5px" }}>
                  <input
                    type='date'
                    className='form-input'
                    name='dateFrom'
                    value={filters.dateFrom}
                    onChange={handleFilterChange}
                  />
                  <input
                    type='date'
                    className='form-input'
                    name='dateTo'
                    value={filters.dateTo}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Дата рег.</th>
                    <th>Статус</th>
                    <th style={{ textAlign: "right" }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingUsers ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={`skeleton-${index}`}>
                        <td>
                          <div className='skeleton' style={{ height: "16px", width: "150px", borderRadius: "4px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "16px", width: "200px", borderRadius: "4px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "24px", width: "100px", borderRadius: "12px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "16px", width: "100px", borderRadius: "4px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "24px", width: "80px", borderRadius: "12px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "32px", width: "200px", borderRadius: "6px", marginLeft: "auto" }} />
                        </td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                        Пользователи не найдены
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} style={{ opacity: user.status === "Удален" ? 0.6 : 1 }}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`badge ${user.role === "Администратор" ? "badge-admin" : "badge-user"}`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString("ru-RU")}</td>
                        <td>
                          <span
                            className={`badge ${user.status === "Активен" ? "badge-active" : "badge-deleted"}`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button className={`btn-primary`} onClick={() => handleOpenEditModal(user)}>
                            Редактировать
                          </button>
                          <button className='' onClick={() => handleOpenResetPasswordModal(user)}>
                            Сбросить пароль
                          </button>
                          {user.status === "Активен" ? (
                            <button className={`btn-danger`} onClick={() => handleDelete(user.id)}>
                              Удалить
                            </button>
                          ) : (
                            <button className='' disabled title='Пользователь уже удален'>
                              Удален
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {usersPagination && usersPagination.totalPages > 1 && (
              <div className='pagination' style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
                <button
                  className='btn'
                  onClick={() => setUsersPage((prev) => Math.max(1, prev - 1))}
                  disabled={usersPage === 1 || isLoadingUsers}
                >
                  Назад
                </button>
                <span style={{ padding: "0 15px" }}>
                  Страница {usersPagination.page} из {usersPagination.totalPages} (Всего: {usersPagination.total})
                </span>
                <button
                  className='btn'
                  onClick={() => setUsersPage((prev) => Math.min(usersPagination.totalPages, prev + 1))}
                  disabled={usersPage === usersPagination.totalPages || isLoadingUsers}
                >
                  Вперед
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div className='section-events'>
            <div className='header-row'>
              <h1>Управление событиями</h1>
              <button className='btn btn-primary' onClick={() => setEventModalOpen(true)}>
                + Создать событие
              </button>
            </div>
            <div className='filters-panel'>
              <label>
                <input
                  type='radio'
                  name='estatus'
                  checked={eventStatusFilter === ""}
                  onChange={() => setEventStatusFilter("")}
                />{" "}
                Все
              </label>
              <label>
                <input
                  type='radio'
                  name='estatus'
                  checked={eventStatusFilter === "Активное"}
                  onChange={() => setEventStatusFilter("Активное")}
                />{" "}
                Активные
              </label>
              <label>
                <input
                  type='radio'
                  name='estatus'
                  checked={eventStatusFilter === "Прошедшее"}
                  onChange={() => setEventStatusFilter("Прошедшее")}
                />{" "}
                Прошедшие
              </label>
              <label>
                <input
                  type='radio'
                  name='estatus'
                  checked={eventStatusFilter === "Отклоненное"}
                  onChange={() => setEventStatusFilter("Отклоненное")}
                />{" "}
                Отклоненные
              </label>
            </div>
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Даты</th>
                    <th>Участники</th>
                    <th>Статус</th>
                    <th style={{ textAlign: "right" }}>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingEvents ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={`skeleton-event-${index}`}>
                        <td>
                          <div className='skeleton' style={{ height: "16px", width: "200px", borderRadius: "4px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "16px", width: "150px", borderRadius: "4px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "16px", width: "80px", borderRadius: "4px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "24px", width: "100px", borderRadius: "12px" }} />
                        </td>
                        <td>
                          <div className='skeleton' style={{ height: "32px", width: "150px", borderRadius: "6px", marginLeft: "auto" }} />
                        </td>
                      </tr>
                    ))
                  ) : events.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>
                        События не найдены
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.id}>
                        <td>{event.title}</td>
                        <td>
                          {new Date(event.startDate).toLocaleDateString("ru-RU")} —{" "}
                          {new Date(event.endDate).toLocaleDateString("ru-RU")}
                        </td>
                        <td>{event.participantsCount} чел.</td>
                        <td>
                          <span
                            className={`badge ${
                              event.status === "Активное"
                                ? "badge-active"
                                : event.status === "Прошедшее"
                                  ? "badge-user"
                                  : "badge-deleted"
                            }`}
                          >
                            {event.status === "Активное"
                              ? "Активно"
                              : event.status === "Прошедшее"
                                ? "Прошло"
                                : "Отклонено"}
                          </span>
                        </td>
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          <button
                            className='btn btn-sm btn-primary'
                            onClick={() => {
                              setCurrentEvent(event);
                              const startDate = new Date(event.startDate);
                              const endDate = new Date(event.endDate);
                              setEventForm({
                                title: event.title,
                                startDate: startDate.toISOString().split("T")[0],
                                endDate: endDate.toISOString().split("T")[0],
                                participantsCount: event.participantsCount,
                                location: null
                              });
                              setEditEventModalOpen(true);
                            }}
                          >
                            Редактировать
                          </button>
                          <button
                            className='btn btn-sm btn-danger'
                            onClick={() => {
                              if (window.confirm(`Вы уверены, что хотите удалить событие "${event.title}"?`)) {
                                deleteEventMutation.mutate({ params: { id: event.id } });
                              }
                            }}
                            disabled={deleteEventMutation.isPending}
                            style={{ marginLeft: "5px" }}
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <CreateEventDialog
        open={isEventModalOpen}
        onOpenChange={setEventModalOpen}
        onSuccess={() => {
          setEventModalOpen(false);
          refetchEvents();
        }}
      />

      {isEditEventModalOpen && currentEvent && (
        <div className='modal-overlay' onClick={() => setEditEventModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <span>Редактирование события: {currentEvent.title}</span>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => setEditEventModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <form className='event-form-grid' onSubmit={handleSaveEvent}>
                <div className='form-group full-width'>
                  <label>Название *</label>
                  <input
                    type='text'
                    name='title'
                    className='form-input'
                    value={eventForm.title}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Начало *</label>
                  <input
                    type='date'
                    name='startDate'
                    className='form-input'
                    value={eventForm.startDate}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Конец *</label>
                  <input
                    type='date'
                    name='endDate'
                    className='form-input'
                    value={eventForm.endDate}
                    onChange={handleEventFormChange}
                    required
                  />
                </div>
                <div className='form-group'>
                  <label>Участники</label>
                  <input
                    type='number'
                    name='participantsCount'
                    className='form-input'
                    value={eventForm.participantsCount}
                    onChange={handleEventFormChange}
                    min={0}
                  />
                </div>
                <div className='form-group full-width'>
                  <label>Категории</label>
                  {isLoadingCategories ? (
                    <div style={{ padding: "10px", color: "var(--muted-foreground)" }}>Загрузка категорий...</div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", minHeight: "50px" }}>
                      {categories.map((category) => {
                        const isSelected = selectedEventCategories.includes(category.id);
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
                                setSelectedEventCategories((prev) => prev.filter((id) => id !== category.id));
                              } else {
                                setSelectedEventCategories((prev) => [...prev, category.id]);
                              }
                            }}
                          >
                            {category.name}
                          </Badge>
                        );
                      })}
                      {categories.length === 0 && (
                        <div style={{ color: "var(--muted-foreground)" }}>Категории не найдены</div>
                      )}
                    </div>
                  )}
                </div>
                <div className='modal-footer full-width' style={{ justifyContent: "flex-end" }}>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => {
                      setEditEventModalOpen(false);
                      setCurrentEvent(null);
                    }}
                    disabled={updateEventMutation.isPending}
                  >
                    Отмена
                  </button>
                  <button
                    className='btn btn-primary'
                    type='submit'
                    disabled={updateEventMutation.isPending}
                  >
                    {updateEventMutation.isPending ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit User Modal */}
      {isEditUserModalOpen && currentUser && (
        <div className='modal-overlay' onClick={() => setEditUserModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <span>Редактирование пользователя: {currentUser.fullName}</span>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => setEditUserModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <form onSubmit={handleSaveUser}>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>ФИО</label>
                  <input
                    type='text'
                    className='form-input'
                    value={userForm.fullName}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Email (нельзя менять)</label>
                  <input
                    type='email'
                    className='form-input'
                    value={currentUser.email}
                    disabled
                    style={{ background: "#eee" }}
                  />
                </div>
                <div className='form-group'>
                  <label>Роль</label>
                  <select
                    className='form-select'
                    value={userForm.role}
                    onChange={(e) =>
                      setUserForm((prev) => ({
                        ...prev,
                        role: e.target.value as "Пользователь" | "Администратор"
                      }))
                    }
                  >
                    <option value='Пользователь'>Пользователь</option>
                    <option value='Администратор'>Администратор</option>
                  </select>
                </div>
                <div className='modal-footer'>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => {
                      setEditUserModalOpen(false);
                      setCurrentUser(null);
                    }}
                    disabled={updateUserMutation.isPending}
                  >
                    Отмена
                  </button>
                  <button className='btn btn-primary' type='submit' disabled={updateUserMutation.isPending}>
                    {updateUserMutation.isPending ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Reset Password Modal (Новое окно) */}
      {isResetPasswordModalOpen && currentUser && (
        <div className='modal-overlay' onClick={() => setResetPasswordModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <span>Сброс пароля для {currentUser.fullName}</span>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => setResetPasswordModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <p>
                Подтвердите сброс пароля для <strong>{currentUser.email}</strong>. После
                подтверждения администратор введет новый пароль, и он будет автоматически отправлен
                пользователю.
              </p>
              <form onSubmit={handleConfirmResetPassword}>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Новый пароль</label>
                  <input
                    type='password'
                    className='form-input'
                    value={passwordForm.password}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                    minLength={8}
                  />
                </div>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Повторите пароль</label>
                  <input
                    type='password'
                    className='form-input'
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    required
                    minLength={8}
                  />
                </div>
                <div className='modal-footer'>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => {
                      setResetPasswordModalOpen(false);
                      setCurrentUser(null);
                    }}
                    disabled={resetPasswordMutation.isPending}
                  >
                    Отмена
                  </button>
                  <button
                    className='btn btn-primary'
                    type='submit'
                    disabled={resetPasswordMutation.isPending}
                  >
                    {resetPasswordMutation.isPending ? "Отправка..." : "Сбросить и отправить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. Create Category Modal */}
      {isCategoryModalOpen && (
        <div className='modal-overlay' onClick={() => setCategoryModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <span>Создание категории</span>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => setCategoryModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!categoryForm.name.trim()) {
                    toast({
                      className: "bg-red-800 text-white hover:bg-red-700",
                      title: "Ошибка",
                      description: "Название категории обязательно"
                    });
                    return;
                  }
                  createCategoryMutation.mutate({
                    params: {
                      name: categoryForm.name.trim(),
                      description: categoryForm.description.trim() || undefined
                    }
                  });
                }}
              >
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Название *</label>
                  <input
                    type='text'
                    className='form-input'
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Описание</label>
                  <textarea
                    className='form-input'
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className='modal-footer'>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => {
                      setCategoryModalOpen(false);
                      setCategoryForm({ name: "", description: "" });
                    }}
                    disabled={createCategoryMutation.isPending}
                  >
                    Отмена
                  </button>
                  <button className='btn btn-primary' type='submit' disabled={createCategoryMutation.isPending}>
                    {createCategoryMutation.isPending ? "Создание..." : "Создать"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 5. Edit Category Modal */}
      {isEditCategoryModalOpen && currentCategory && (
        <div className='modal-overlay' onClick={() => setEditCategoryModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <span>Редактирование категории: {currentCategory.name}</span>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => setEditCategoryModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!categoryForm.name.trim()) {
                    toast({
                      className: "bg-red-800 text-white hover:bg-red-700",
                      title: "Ошибка",
                      description: "Название категории обязательно"
                    });
                    return;
                  }
                  updateCategoryMutation.mutate({
                    params: {
                      id: currentCategory.id,
                      name: categoryForm.name.trim(),
                      description: categoryForm.description.trim() || undefined
                    }
                  });
                }}
              >
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Название *</label>
                  <input
                    type='text'
                    className='form-input'
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Описание</label>
                  <textarea
                    className='form-input'
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className='modal-footer'>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => {
                      setEditCategoryModalOpen(false);
                      setCurrentCategory(null);
                      setCategoryForm({ name: "", description: "" });
                    }}
                    disabled={updateCategoryMutation.isPending}
                  >
                    Отмена
                  </button>
                  <button className='btn btn-primary' type='submit' disabled={updateCategoryMutation.isPending}>
                    {updateCategoryMutation.isPending ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminPage;
