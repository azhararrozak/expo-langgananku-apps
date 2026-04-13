/**
 * store/useAuthStore.ts
 * =====================
 * Zustand store untuk mengelola state autentikasi.
 *
 * Disesuaikan dengan API backend:
 * - Login  : POST /api/auth/signin  → { id, username, email, roles, accessToken, refreshToken }
 * - Register: POST /api/auth/signup → { message } (lalu harus login manual)
 * - Refresh : POST /api/auth/refreshtoken → { accessToken, refreshToken }
 *
 * State yang dikelola:
 * - user          : data user yang sedang login (null jika belum login)
 * - token         : JWT access token (null jika belum login)
 * - refreshToken  : Token untuk refresh access token
 * - isLoading     : apakah sedang proses login/register
 * - error         : pesan error jika login/register gagal
 *
 * State ini di-persist ke AsyncStorage, jadi user tidak perlu
 * login ulang setiap buka aplikasi.
 *
 * Cara pakai di komponen:
 * ```tsx
 * import { useAuthStore } from '../store/useAuthStore';
 *
 * function MyComponent() {
 *   const { user, isLoading, login, logout } = useAuthStore();
 *
 *   // Cek apakah sudah login
 *   if (user) {
 *     return <Text>Halo, {user.username}!</Text>;
 *   }
 * }
 * ```
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginPayload, RegisterPayload } from '../types/user';
import * as authService from '../services/authService';

// ──────────────────────────────────────────────
// 1. Definisi tipe state dan actions
// ──────────────────────────────────────────────

interface AuthState {
  // === STATE ===
  user: User | null;             // Data user yang login
  token: string | null;          // JWT access token
  refreshToken: string | null;   // Refresh token
  isLoading: boolean;            // Sedang proses login/register?
  error: string | null;          // Pesan error

  // === STATUS ===
  isAuthenticated: boolean;      // Shortcut: apakah sudah login?
  isHydrated: boolean;           // Apakah data dari AsyncStorage sudah dimuat?

  // === ACTIONS ===
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  clearError: () => void;
  setHydrated: (value: boolean) => void;
}

// ──────────────────────────────────────────────
// 2. Buat store dengan persist middleware
// ──────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // --- Initial State ---
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      isHydrated: false,

      // --- Actions ---

      /**
       * Login ke backend
       *
       * Alur:
       * 1. Kirim { username, password } ke POST /api/auth/signin
       * 2. Backend mengembalikan { id, username, email, roles, accessToken, refreshToken }
       * 3. Simpan user data dan token ke store
       *
       * ⚠️ Login menggunakan USERNAME, bukan email!
       */
      login: async (payload: LoginPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.loginUser(payload);

          // Mapping response ke User object
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            roles: response.roles,
          };

          set({
            user,
            token: response.accessToken,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login gagal';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      /**
       * Register akun baru
       *
       * Alur:
       * 1. Kirim { username, email, password } ke POST /api/auth/signup
       * 2. Backend mengembalikan { message: "User was registered successfully!" }
       * 3. ⚠️ Register TIDAK otomatis login! User harus login manual setelahnya.
       *
       * Error yang mungkin:
       * - "Failed! Username is already in use!"
       * - "Failed! Email is already in use!"
       */
      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null });
        try {
          await authService.registerUser(payload);
          // Register sukses! Tapi TIDAK auto-login.
          // Set isLoading false, biarkan screen redirect ke login.
          set({ isLoading: false, error: null });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Registrasi gagal';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      /**
       * Refresh access token yang expired
       *
       * Alur:
       * 1. Kirim { refreshToken } ke POST /api/auth/refreshtoken
       * 2. Backend mengembalikan accessToken dan refreshToken baru
       * 3. Update store dengan token baru
       *
       * @returns true jika refresh berhasil, false jika gagal
       */
      refreshAccessToken: async () => {
        const currentRefreshToken = get().refreshToken;
        if (!currentRefreshToken) return false;

        try {
          const response = await authService.refreshToken(currentRefreshToken);
          set({
            token: response.accessToken,
            refreshToken: response.refreshToken,
          });
          return true;
        } catch {
          // Refresh gagal → bersihkan auth state
          return false;
        }
      },

      /**
       * Logout: hapus semua data auth dari store dan AsyncStorage
       */
      logout: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      /**
       * Hapus pesan error (misal setelah user dismiss alert)
       */
      clearError: () => set({ error: null }),

      /**
       * Set hydrated status (dipanggil otomatis oleh zustand persist)
       */
      setHydrated: (value: boolean) => set({ isHydrated: value }),
    }),
    {
      // Konfigurasi persist ke AsyncStorage
      name: 'auth-storage',                          // Key di AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), // Gunakan AsyncStorage
      partialize: (state) => ({                       // Hanya simpan field ini ke storage
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Dipanggil setelah data dari AsyncStorage berhasil dimuat
        state?.setHydrated(true);
      },
    }
  )
);
