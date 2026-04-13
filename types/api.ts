/**
 * Tipe-tipe untuk API Response
 * Semua response dari backend akan dibungkus dalam format ini
 */

/**
 * Format standar response sukses dari API
 * T = tipe data yang dikembalikan (bisa User, Subscription, dll.)
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Format standar response error dari API
 */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Format response untuk data yang menggunakan pagination
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}
