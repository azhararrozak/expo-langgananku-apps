/**
 * services/api.ts
 * ===============
 * Base API client - tempat konfigurasi dasar untuk semua request ke backend.
 *
 * Cara kerja:
 * 1. Semua request melewati fungsi `api()` ini
 * 2. Token otomatis ditambahkan ke header `x-access-token` jika user sudah login
 * 3. Jika token expired (401), coba refresh token otomatis
 * 4. Jika refresh gagal, user di-logout
 *
 * Sesuaikan BASE_URL untuk development vs production.
 */

import { useAuthStore } from '../store/useAuthStore';

// ──────────────────────────────────────────────
// ⚠️ Ganti sesuai environment kamu
// ──────────────────────────────────────────────
// Untuk Android emulator: 'http://10.0.2.2:3000'
// Untuk iOS simulator:    'http://localhost:3000'
// Untuk device fisik:     'http://<IP-KOMPUTER-KAMU>:3000'
// const BASE_URL = 'http://10.0.2.2:3000';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Fungsi utama untuk melakukan HTTP request ke backend
 *
 * @param endpoint - Path API, contoh: '/api/auth/signin'
 * @param options  - Opsi fetch (method, body, dll.)
 * @returns Data response dari backend
 *
 * Contoh penggunaan:
 * ```ts
 * const data = await api('/api/auth/signin', {
 *   method: 'POST',
 *   body: JSON.stringify({ username: 'azhar', password: 'Password123' }),
 * });
 * ```
 */
export async function api<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Ambil token dari auth store
  const { token, refreshAccessToken, logout } = useAuthStore.getState();

  // Siapkan headers default
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Tambahkan token ke header x-access-token (sesuai spec backend)
  if (token) {
    headers['x-access-token'] = token;
  }

  // Lakukan request
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // ─── Handle 401: Token expired ────────────────────
  if (response.status === 401) {
    // Coba refresh token
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // Retry request dengan token baru
      const newToken = useAuthStore.getState().token;
      headers['x-access-token'] = newToken!;

      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => null);
        throw new Error(
          errorData?.message || `Request gagal dengan status ${retryResponse.status}`
        );
      }

      return retryResponse.json();
    }

    // Refresh gagal → logout
    logout();
    throw new Error('Sesi habis, silakan login kembali');
  }

  // ─── Handle error lainnya ─────────────────────────
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Request gagal dengan status ${response.status}`);
  }

  // Parse response sebagai JSON
  const data: T = await response.json();
  return data;
}
