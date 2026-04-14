import { api } from './api';

export interface MonthlySpendingData {
  year: number;
  month: number;
  label: string; // e.g. "Mei 2025"
  total: number;
}

export interface MonthlySpendingResponse {
  period: string;
  trend: {
    percentage: number;
    direction: 'up' | 'down' | 'stable';
    description: string;
  };
  data: MonthlySpendingData[];
}

export async function getMonthlySpending(): Promise<MonthlySpendingResponse> {
  return api<MonthlySpendingResponse>('/api/dashboard/monthly-spending');
}
