export type UserRole = "candidate" | "recruiter";

export interface User {
  _id: string;
  fullName: string;
  username?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  avatarPublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
  username?: string;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => Promise<void>;
}