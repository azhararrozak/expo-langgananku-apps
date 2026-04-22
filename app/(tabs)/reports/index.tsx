import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';
import CustomHeader from '../../../components/CustomHeader';
import { useSubscriptionStore } from '../../../store/useSubscriptionStore';
import { getMonthlySpending, MonthlySpendingResponse } from '../../../services/dashboardService';
import { router } from 'expo-router';

const getCategoryIcon = (category?: string) => {
  switch (category?.toLowerCase()) {
    case 'hiburan':
    case 'streaming': return 'movie';
    case 'musik':
    case 'music': return 'music-note';
    case 'kesehatan & olahraga':
    case 'gym': return 'fitness-center';
    case 'cloud & storage':
    case 'cloud': return 'cloud';
    case 'produktivitas':
    case 'productivity': return 'rocket-launch';
    default: return 'category';
  }
};

const ReportsScreen = () => {
  const { subscriptions, fetchSubscriptions, isLoading } = useSubscriptionStore();
  const [spendingData, setSpendingData] = useState<MonthlySpendingResponse | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    const fetchDashboard = async () => {
      setIsDashboardLoading(true);
      try {
        const data = await getMonthlySpending();
        setSpendingData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsDashboardLoading(false);
      }
    };
    fetchDashboard();
  }, [fetchSubscriptions]);

  const totalCost = useMemo(() => {
    return subscriptions.reduce((sum, sub) => sum + sub.cost, 0);
  }, [subscriptions]);

  const budget = 2000000;
  const budgetUtilization = Math.min((totalCost / budget) * 100, 100);

  const topCategories = useMemo(() => {
    if (totalCost === 0) return [];
    
    const catMap: Record<string, number> = {};
    subscriptions.forEach(sub => {
      const cat = sub.category || 'Lainnya';
      catMap[cat] = (catMap[cat] || 0) + sub.cost;
    });

    return Object.entries(catMap)
      .map(([name, cost]) => ({
        name,
        cost,
        percentage: Math.round((cost / totalCost) * 100),
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [subscriptions, totalCost]);

  const trend = spendingData?.trend;

  return (
    <View className="flex-1 bg-background">
      <CustomHeader title="Langgananku" />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mb-10 mt-2 flex-col p-4">
          <Text className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
            Financial Insight
          </Text>
          <Text className="font-headline text-4xl font-extrabold tracking-tight text-primary">
            Monthly Reports
          </Text>

          {/* Spending Summary Card */}
          <View className="relative mt-8 overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
            {/* Decorative Corner */}
            <View className="absolute -right-8 -top-8 h-32 w-32 rounded-bl-full bg-secondary-container/20" />

            <View className="relative z-10">
              <Text className="mb-5 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Spending Summary
              </Text>

              <View className="flex-col gap-4">
                <View>
                  <Text className="text-sm font-medium text-on-surface-variant">
                    Total This Month
                  </Text>
                  <Text className="mt-1 font-headline text-4xl font-extrabold text-primary">
                    Rp {totalCost.toLocaleString('id-ID')}
                  </Text>
                </View>

                {isDashboardLoading ? (
                  <ActivityIndicator size="small" color={colors.secondary.DEFAULT} className="self-start" />
                ) : trend ? (
                  <View className="flex-row items-center gap-2 self-start rounded-full bg-secondary-container/40 px-4 py-2">
                    <MaterialIcons 
                      name={trend.direction === 'up' ? 'trending-up' : trend.direction === 'down' ? 'trending-down' : 'trending-flat'} 
                      size={20} 
                      color={colors.secondary.DEFAULT} 
                    />
                    <Text className="text-sm font-bold text-secondary">{trend.percentage}% vs last month</Text>
                  </View>
                ) : null}
              </View>

              {/* Spending Pulse */}
              <View className="mt-8">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-on-surface text-sm font-bold">Budget Utilization</Text>
                  <Text className="text-sm font-medium text-on-surface-variant">
                    Rp {totalCost.toLocaleString('id-ID')} / 2.000.000
                  </Text>
                </View>
                <View className="h-4 w-full overflow-hidden rounded-full bg-secondary-container/30">
                  <View 
                    className="h-full rounded-full bg-secondary shadow-sm" 
                    style={{ width: `${budgetUtilization}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Categories */}
          <View className="mt-4 flex-col justify-between rounded-[2rem] bg-primary p-6 shadow-md">
            <View>
              <Text className="mb-6 font-headline text-lg font-bold text-on-primary">
                Top Categories
              </Text>

              {isLoading ? (
                <ActivityIndicator size="large" color="white" />
              ) : topCategories.length === 0 ? (
                <Text className="text-on-primary text-center my-4 opacity-80">Belum ada data langganan.</Text>
              ) : (
                <View className="flex-col gap-5">
                  {topCategories.map((cat) => (
                    <Pressable 
                      key={cat.name} 
                      className="flex-row items-center justify-between active:opacity-70"
                      onPress={() => router.push({ pathname: '/(tabs)/reports/details', params: { category: cat.name } })}
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="rounded-xl bg-white/10 p-2">
                          <MaterialIcons name={getCategoryIcon(cat.name)} size={20} color={colors.secondary.DEFAULT} />
                        </View>
                        <Text className="text-base font-medium text-on-primary">{cat.name}</Text>
                      </View>
                      <Text className="text-base font-bold text-on-primary">{cat.percentage}%</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Action Button */}
            {topCategories.length > 0 && (
              <Pressable className="mt-8 w-full flex-row items-center justify-center gap-2 rounded-2xl bg-secondary-fixed px-6 py-3">
                <Text className="font-bold text-on-secondary-fixed">View All Analytics</Text>
                <MaterialIcons name="arrow-forward-ios" size={14} color="#000000" />
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportsScreen;
