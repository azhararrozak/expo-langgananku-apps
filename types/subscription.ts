/**
 * Tipe data untuk Subscription (Langganan)
 */

export interface Subscription {
  id: string;
  name: string;
  notes?: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  category?: string;
  icon?: string;
  status: 'active' | 'paused' | 'cancelled';
  notifyBefore?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data yang dikirim saat membuat/edit subscription
 */
export interface SubscriptionPayload {
  name: string;
  notes?: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  category?: string;
  icon?: string;
  notifyBefore?: number;
}
