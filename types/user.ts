/**
 * Tipe data untuk User
 * =====================
 * Sesuai dengan response dari backend POST /api/auth/signin
 */

export interface User {
  id: string;          // MongoDB ObjectId dari backend
  username: string;    // Username unik
  email: string;       // Email unik
  roles: string[];     // Daftar role, contoh: ["ROLE_USER"]
}

/**
 * Data yang dikirim saat login
 * Endpoint: POST /api/auth/signin
 *
 * Contoh:
 * ```json
 * { "username": "azhar", "password": "Password123" }
 * ```
 */
export interface LoginPayload {
  username: string;    // Username yang terdaftar (bukan email!)
  password: string;    // Password yang terdaftar
}

/**
 * Data yang dikirim saat register
 * Endpoint: POST /api/auth/signup
 *
 * Contoh:
 * ```json
 * { "username": "azhar", "email": "azhar@email.com", "password": "Password123" }
 * ```
 */
export interface RegisterPayload {
  username: string;    // Harus unik
  email: string;       // Harus unik
  password: string;    // Akan di-hash oleh server
}

/**
 * Response sukses dari POST /api/auth/signin
 *
 * Contoh response:
 * ```json
 * {
 *   "id": "69db92242b7b74a7dfb8f2b4",
 *   "username": "azhar",
 *   "email": "azhar@email.com",
 *   "roles": ["ROLE_USER"],
 *   "accessToken": "eyJhbGciOiJIUz...",
 *   "refreshToken": "19fdd395-7dc8-..."
 * }
 * ```
 */
export interface LoginResponse {
  id: string;
  username: string;
  email: string;
  roles: string[];
  accessToken: string;
  refreshToken: string;
}

/**
 * Response sukses dari POST /api/auth/signup
 *
 * Contoh response:
 * ```json
 * { "message": "User was registered successfully!" }
 * ```
 */
export interface RegisterResponse {
  message: string;
}

/**
 * Response sukses dari POST /api/auth/refreshtoken
 *
 * Contoh response:
 * ```json
 * {
 *   "accessToken": "eyJhbGciOiJIUz...",
 *   "refreshToken": "19fdd395-7dc8-..."
 * }
 * ```
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
