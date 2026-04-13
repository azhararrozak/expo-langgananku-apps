/**
 * services/subscriptionService.ts
 * ================================
 * Kumpulan fungsi untuk komunikasi dengan API Subscription.
 *
 * Alur: Screen → Store → Service → API
 */

import { api } from './api';
import { Subscription, SubscriptionPayload } from '../types/subscription';
import { ApiResponse, PaginatedResponse } from '../types/api';

/**
 * Ambil semua subscription milik user
 */
export async function getSubscriptions(page = 1): Promise<PaginatedResponse<Subscription>> {
  return api<PaginatedResponse<Subscription>>(`/api/subscriptions?page=${page}`);
}

/**
 * Ambil detail satu subscription
 * @param id - ID subscription
 */
export async function getSubscriptionById(id: string): Promise<Subscription> {
  const response = await api<ApiResponse<Subscription>>(`/api/subscriptions/${id}`);
  return response.data;
}

/**
 * Buat subscription baru
 * @param payload - Data subscription yang akan dibuat
 */
export async function createSubscription(payload: SubscriptionPayload): Promise<Subscription> {
  const response = await api<ApiResponse<Subscription>>('/api/subscriptions', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.data;
}

/**
 * Update subscription yang sudah ada
 * @param id      - ID subscription
 * @param payload - Data yang akan diupdate
 */
export async function updateSubscription(
  id: string,
  payload: Partial<SubscriptionPayload>
): Promise<Subscription> {
  const response = await api<ApiResponse<Subscription>>(`/api/subscriptions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.data;
}

/**
 * Hapus subscription
 * @param id - ID subscription yang akan dihapus
 */
export async function deleteSubscription(id: string): Promise<void> {
  await api(`/api/subscriptions/${id}`, { method: 'DELETE' });
}
