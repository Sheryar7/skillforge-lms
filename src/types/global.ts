/**
 * Unified type response matrix configuration for Server Actions
 */
export type ActionResponse<T = void> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };

/**
 * Standard Next.js Dynamic App Router Page parameters
 */
export interface PageParams {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Global User Role Definition Context
 */
export type UserRole = "instructor" | "student";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
}