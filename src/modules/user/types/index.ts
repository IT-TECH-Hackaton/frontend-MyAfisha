export interface UserData {
  uid: string;
  firstName?: string;
  secondName?: string;
  fullName?: string;
  mail: string;
  phone?: string;
  tag?: string;
  birthDate?: string;
  image?: Image;
  role: string;
  interests?: Array<{ id: string; name: string }>;
}
