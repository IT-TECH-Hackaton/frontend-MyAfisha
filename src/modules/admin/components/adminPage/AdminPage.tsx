import { useMemo, useState } from "react";

import { YandexMapPicker } from "@shared/ui/yandex-map-picker";

import "./AdminPage.css";

type Role = "Admin" | "User";
type UserStatus = "Active" | "Deleted";
interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  registeredAt: string;
  status: UserStatus;
}
interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
  status: "Active" | "Passed";
}

const initialUsers: User[] = [
  {
    id: 1,
    name: "Иван Иванов",
    email: "ivan@test.com",
    role: "Admin",
    registeredAt: "2023-10-01",
    status: "Active"
  },
  {
    id: 2,
    name: "Петр Петров",
    email: "petr@test.com",
    role: "User",
    registeredAt: "2023-11-15",
    status: "Active"
  },
  {
    id: 3,
    name: "Сидор Сидоров",
    email: "sidor@test.com",
    role: "User",
    registeredAt: "2023-01-20",
    status: "Deleted"
  }
];
const initialEvents: Event[] = [
  {
    id: 1,
    title: "Новогодний корпоратив",
    startDate: "2023-12-25",
    endDate: "2023-12-26",
    participantsCount: 45,
    status: "Active"
  },
  {
    id: 2,
    title: "Сбор на ДР",
    startDate: "2023-11-01",
    endDate: "2023-11-01",
    participantsCount: 12,
    status: "Passed"
  }
];

interface UserFilters {
  name: string;
  role: Role | "";
  status: UserStatus | "";
  dateFrom: string;
  dateTo: string;
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<"users" | "events">("users");

  const [users, setUsers] = useState<User[]>(initialUsers);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [filters, setFilters] = useState<UserFilters>({
    name: "",
    role: "",
    status: "Active",
    dateFrom: "",
    dateTo: ""
  });

  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const [isEditEventModalOpen, setEditEventModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    participantsCount: 0,
    location: null as { lat: number; lon: number; address?: string } | null
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = (userId: number) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя (мягкое удаление)?`)) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? { ...u, status: "Deleted" } : u))
      );
      alert("Пользователь помечен как удаленный.");
    }
  };

  const handleOpenEditModal = (user: User) => {
    setCurrentUser(user);
    setEditUserModalOpen(true);
  };

  const handleOpenResetPasswordModal = (user: User) => {
    setCurrentUser(user);
    setResetPasswordModalOpen(true);
  };

  const handleOpenEditEventModal = (event: Event) => {
    setCurrentEvent(event);
    setEventForm({
      title: event.title,
      startDate: event.startDate,
      endDate: event.endDate,
      participantsCount: event.participantsCount,
      location: null
    });
    setEditEventModalOpen(true);
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
      alert("Дата окончания должна быть позже даты начала");
      return;
    }

    const now = new Date();
    const endDate = new Date(eventForm.endDate);
    const updatedStatus = endDate.getTime() && endDate < now ? "Passed" : "Active";

    setEvents((prev) =>
      prev.map((evt) =>
        evt.id === currentEvent.id
          ? {
              ...evt,
              ...eventForm,
              status: updatedStatus
            }
          : evt
      )
    );
    setEditEventModalOpen(false);
    setCurrentEvent(null);
    alert("Событие обновлено (клиентская симуляция)");
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Изменения сохранены (только на клиенте)");
    setEditUserModalOpen(false);
    setCurrentUser(null);
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Пароль для ${currentUser?.email} успешно сброшен и отправлен на почту.`);
    setResetPasswordModalOpen(false);
    setCurrentUser(null);
  };

  const filteredUsers = useMemo(() => {
    let list = users;

    if (filters.name) {
      list = list.filter((user) => user.name.toLowerCase().includes(filters.name.toLowerCase()));
    }

    if (filters.role) {
      list = list.filter((user) => user.role === filters.role);
    }

    if (filters.status) {
      list = list.filter((user) => user.status === filters.status);
    }

    if (filters.dateFrom) {
      list = list.filter((user) => user.registeredAt >= filters.dateFrom);
    }
    if (filters.dateTo) {
      list = list.filter((user) => user.registeredAt <= filters.dateTo);
    }

    return list;
  }, [users, filters]);

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
                  name='name'
                  value={filters.name}
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
                  <option value='Admin'>Администратор</option>
                  <option value='User'>Пользователь</option>
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
                  <option value='Active'>Активен</option>
                  <option value='Deleted'>Удален</option>
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
                  {filteredUsers.map((user) => (
                    <tr key={user.id} style={{ opacity: user.status === "Deleted" ? 0.6 : 1 }}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`badge ${user.role === "Admin" ? "badge-admin" : "badge-user"}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>{user.registeredAt}</td>
                      <td>
                        <span
                          className={`badge ${user.status === "Active" ? "badge-active" : "badge-deleted"}`}
                        >
                          {user.status === "Active" ? "Активен" : "Удален"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                        <button className={`btn-primary`} onClick={() => handleOpenEditModal(user)}>
                          Редактировать
                        </button>
                        <button className='' onClick={() => handleOpenResetPasswordModal(user)}>
                          Сбросить пароль
                        </button>
                        {user.status === "Active" ? (
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
                  ))}
                </tbody>
              </table>
            </div>
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
                <input type='radio' name='estatus' defaultChecked /> Все
              </label>
              <label>
                <input type='radio' name='estatus' /> Активные
              </label>
              <label>
                <input type='radio' name='estatus' /> Прошедшие
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
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>
                        {event.startDate} — {event.endDate}
                      </td>
                      <td>{event.participantsCount} чел.</td>
                      <td>
                        <span
                          className={`badge ${event.status === "Active" ? "badge-active" : "badge-user"}`}
                        >
                          {event.status === "Active" ? "Активно" : "Прошло"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className='btn btn-sm btn-primary'
                          onClick={() => handleOpenEditEventModal(event)}
                        >
                          Редактировать
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {isEventModalOpen && (
        <div className='modal-overlay' onClick={() => setEventModalOpen(false)}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <span>Создание события</span>
              <button
                style={{ border: "none", background: "transparent", cursor: "pointer" }}
                onClick={() => setEventModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className='modal-body'>
              <form className='event-form-grid'>
                <div className='form-group full-width'>
                  <label>Название события *</label>
                  <input type='text' className='form-input' />
                </div>
                <div className='form-group full-width'>
                  <label>Краткое описание</label>
                  <input type='text' className='form-input' />
                </div>
                <div className='form-group full-width'>
                  <label>Полное описание *</label>
                  <textarea className='form-input' rows={3}></textarea>
                </div>
                <div className='form-group'>
                  <label>Начало *</label>
                  <input type='datetime-local' className='form-input' />
                </div>
                <div className='form-group'>
                  <label>Конец *</label>
                  <input type='datetime-local' className='form-input' />
                </div>
                <div className='form-group full-width'>
                  <label>Изображение *</label>
                  <input type='file' className='form-input' />
                </div>
                <div className='form-group full-width'>
                  <label>Данные по оплате</label>
                  <textarea className='form-input' placeholder='Реквизиты, сумма...'></textarea>
                </div>
                <div className='form-group full-width'>
                  <label>Место проведения</label>
                  <YandexMapPicker
                    onLocationSelect={(coordinates: { lat: number; lon: number }, address?: string) => {
                      setEventForm((prev) => ({
                        ...prev,
                        location: { ...coordinates, address }
                      }));
                    }}
                    className='mt-2'
                  />
                </div>
                <div className='form-group full-width'>
                  <label>Участники (multiselect)</label>
                  <select multiple className='form-select' style={{ height: "100px" }}>
                    <option>Иванов И.И.</option>
                    <option>Петров П.П.</option>
                    <option>Сидоров С.С.</option>
                  </select>
                </div>
              </form>
            </div>
            <div className='modal-footer'>
              <button className='btn' onClick={() => setEventModalOpen(false)}>
                Отмена
              </button>
              <button
                className='btn btn-primary'
                onClick={() => {
                  console.log("Адрес события:", eventForm.location?.address);
                  console.log("Координаты события:", eventForm.location);
                  console.log("Полная форма события:", eventForm);
                }}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

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
                <div className='modal-footer full-width' style={{ justifyContent: "flex-end" }}>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => setEditEventModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button className='btn btn-primary' type='submit'>
                    Сохранить
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
              <span>Редактирование пользователя: {currentUser.name}</span>
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
                  <input type='text' className='form-input' defaultValue={currentUser.name} />
                </div>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Email (нельзя менять)</label>
                  <input
                    type='email'
                    className='form-input'
                    defaultValue={currentUser.email}
                    disabled
                    style={{ background: "#eee" }}
                  />
                </div>
                <div className='form-group'>
                  <label>Роль</label>
                  <select className='form-select' defaultValue={currentUser.role}>
                    <option>User</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className='modal-footer'>
                  <button className='btn' type='button' onClick={() => setEditUserModalOpen(false)}>
                    Отмена
                  </button>
                  <button className='btn btn-primary' type='submit'>
                    Сохранить
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
              <span>Сброс пароля для {currentUser.name}</span>
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
                  <input type='password' className='form-input' required />
                </div>
                <div className='form-group' style={{ marginBottom: "15px" }}>
                  <label>Повторите пароль</label>
                  <input type='password' className='form-input' required />
                </div>
                <div className='modal-footer'>
                  <button
                    className='btn'
                    type='button'
                    onClick={() => setResetPasswordModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button className='btn btn-primary' type='submit'>
                    Сбросить и отправить
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
