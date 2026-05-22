export type UserRole = "student" | "instructor";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at?: string;
}

export interface AuthResponse {
  user: any | null;
  profile: UserProfile | null;
  error: string | null;
}