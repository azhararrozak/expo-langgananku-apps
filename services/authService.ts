/**
 * services/authService.ts
 * =======================
 * Kumpulan fungsi untuk komunikasi dengan API Auth.
 *
 * Endpoint yang digunakan:
 * - POST /api/auth/signup       → Register
 * - POST /api/auth/signin       → Login
 * - POST /api/auth/refreshtoken → Refresh Token
 *
 * Alur: Screen → Store → Service → API
 */

import { api } from './api';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  RefreshTokenResponse,
} from '../types/user';

/**
 * Register akun baru
 *
 * Endpoint: POST /api/auth/signup
 * Body:     { username, email, password }
 * Response: { message: "User was registered successfully!" }
 *
 * ⚠️ Register TIDAK mengembalikan token!
 *    Setelah register sukses, user harus login manual.
 */
export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  return api<RegisterResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login ke backend
 *
 * Endpoint: POST /api/auth/signin
 * Body:     { username, password }
 * Response: { id, username, email, roles, accessToken, refreshToken }
 */
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return api<LoginResponse>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Refresh access token yang sudah expired
 *
 * Endpoint: POST /api/auth/refreshtoken
 * Body:     { refreshToken }
 * Response: { accessToken, refreshToken }
 *
 * Dipanggil otomatis oleh api.ts ketika mendapat response 401
 */
export async function refreshToken(currentRefreshToken: string): Promise<RefreshTokenResponse> {
  // PENTING: Tidak menggunakan fungsi api() karena bisa infinite loop
  // (api() memanggil refreshToken saat 401)
  const response = await fetch('http://10.0.2.2:3000/api/auth/refreshtoken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: currentRefreshToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Gagal refresh token');
  }

  return response.json();
}
