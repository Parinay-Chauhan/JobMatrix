export type UserRole = "candidate" | "recruiter";

export interface User {
  _id: string;
  fullName: string;
  username?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => Promise<void>;
}