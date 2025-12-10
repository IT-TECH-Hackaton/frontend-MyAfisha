export type AdminTab = "users" | "events" | "categories";
export type UserRole = "Пользователь" | "Администратор";
export type UserStatus = "Активен" | "Удален";
export type EventStatus = "Активное" | "Прошедшее" | "Отклоненное";

export interface UserFilters {
  fullName: string;
  role: UserRole | "";
  status: UserStatus | "";
  dateFrom: string;
  dateTo: string;
}

export interface UserFormData {
  fullName: string;
  role: UserRole;
}

export interface PasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface EventFormData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  startDate: string;
  endDate: string;
  maxParticipants: number | undefined;
  paymentInfo: string;
  address: string;
  status: EventStatus;
  location: { lat: number; lon: number; address?: string } | null;
}

export interface CategoryFormData {
  name: string;
  description: string;
}