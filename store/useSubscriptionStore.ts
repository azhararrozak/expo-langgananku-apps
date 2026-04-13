/**
 * store/useSubscriptionStore.ts
 * =============================
 * Zustand store untuk mengelola state Subscription (langganan).
 *
 * State yang dikelola:
 * - subscriptions : daftar semua langganan
 * - selectedSub   : detail langganan yang sedang dipilih
 * - isLoading     : sedang fetch data?
 * - error         : pesan error
 *
 * Cara pakai di komponen:
 * ```tsx
 * import { useSubscriptionStore } from '../store/useSubscriptionStore';
 *
 * function SubscriptionList() {
 *   const { subscriptions, isLoading, fetchSubscriptions } = useSubscriptionStore();
 *
 *   useEffect(() => {
 *     fetchSubscriptions();
 *   }, []);
 *
 *   if (isLoading) return <ActivityIndicator />;
 *
 *   return subscriptions.map(sub => <Text>{sub.name}</Text>);
 * }
 * ```
 */

import { create } from 'zustand';
import { Subscription, SubscriptionPayload } from '../types/subscription';
import * as subscriptionService from '../services/subscriptionService';

// ──────────────────────────────────────────────
// 1. Definisi tipe state dan actions
// ──────────────────────────────────────────────

interface SubscriptionState {
  // === STATE ===
  subscriptions: Subscription[];       // Daftar semua langganan
  selectedSubscription: Subscription | null; // Detail langganan yang dipilih
  isLoading: boolean;                  // Sedang fetch data?
  error: string | null;               // Pesan error

  // === ACTIONS ===
  fetchSubscriptions: () => Promise<void>;
  fetchSubscriptionById: (id: string) => Promise<void>;
  addSubscription: (payload: SubscriptionPayload) => Promise<void>;
  editSubscription: (id: string, payload: Partial<SubscriptionPayload>) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelected: () => void;
}

// ──────────────────────────────────────────────
// 2. Buat store
// ──────────────────────────────────────────────

export const useSubscriptionStore = create<SubscriptionState>()((set) => ({
  // --- Initial State ---
  subscriptions: [],
  selectedSubscription: null,
  isLoading: false,
  error: null,

  // --- Actions ---

  /**
   * Ambil semua subscription dari backend
   */
  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await subscriptionService.getSubscriptions();
      set({ subscriptions: response.data, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat langganan';
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Ambil detail satu subscription
   */
  fetchSubscriptionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const subscription = await subscriptionService.getSubscriptionById(id);
      set({ selectedSubscription: subscription, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal memuat detail langganan';
      set({ isLoading: false, error: message });
    }
  },

  /**
   * Tambah subscription baru
   */
  addSubscription: async (payload: SubscriptionPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newSub = await subscriptionService.createSubscription(payload);
      set((state) => ({
        subscriptions: [newSub, ...state.subscriptions],
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menambah langganan';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  /**
   * Edit subscription yang sudah ada
   */
  editSubscription: async (id: string, payload: Partial<SubscriptionPayload>) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await subscriptionService.updateSubscription(id, payload);
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) => (sub.id === id ? updated : sub)),
        selectedSubscription:
          state.selectedSubscription?.id === id ? updated : state.selectedSubscription,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal mengupdate langganan';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  /**
   * Hapus subscription
   */
  removeSubscription: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await subscriptionService.deleteSubscription(id);
      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        selectedSubscription:
          state.selectedSubscription?.id === id ? null : state.selectedSubscription,
        isLoading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus langganan';
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  /**
   * Hapus pesan error
   */
  clearError: () => set({ error: null }),

  /**
   * Reset selected subscription
   */
  clearSelected: () => set({ selectedSubscription: null }),
}));
