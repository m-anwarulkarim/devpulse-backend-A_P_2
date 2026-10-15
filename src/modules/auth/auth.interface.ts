export type UserRole = "contributor" | "maintainer";

export interface IUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ILoginResponse {
  token: string;
  user: Omit<IUser, "password">;
}
