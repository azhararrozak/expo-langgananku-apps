import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';
import { useSubscriptionStore } from '../../../store/useSubscriptionStore';

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

// ─── Single Category Detail View ───────────────────────────
const SingleCategoryView = ({
  categoryName,
  subscriptions,
}: {
  categoryName: string;
  subscriptions: any[];
}) => {
  const filtered = useMemo(
    () => subscriptions.filter(sub => (sub.category || 'Lainnya') === categoryName),
    [subscriptions, categoryName],
  );

  const totalCost = useMemo(
    () => filtered.reduce((sum, sub) => sum + sub.cost, 0),
    [filtered],
  );

  return (
    <>
      <View className="mb-8 items-center">
        <View className="mb-4 rounded-3xl bg-secondary-container/20 p-6">
          <MaterialIcons name={getCategoryIcon(categoryName)} size={48} color={colors.secondary.DEFAULT} />
        </View>
        <Text className="text-2xl font-bold text-on-surface">{categoryName}</Text>
        <Text className="mt-2 text-xl font-extrabold text-primary">Rp {totalCost.toLocaleString('id-ID')}</Text>
        <Text className="text-sm font-medium text-on-surface-variant">Total per bulan</Text>
      </View>

      <Text className="mb-4 font-headline text-lg font-bold text-on-surface">Daftar Langganan</Text>
      <View className="gap-3 mb-10">
        {filtered.map(sub => (
          <View key={sub.id} className="flex-row items-center justify-between rounded-2xl bg-surface-container-low p-4">
            <View className="flex-row items-center gap-4">
              <View className="rounded-full bg-primary/10 p-3">
                <MaterialIcons name={getCategoryIcon(categoryName)} size={24} color={colors.primary.DEFAULT} />
              </View>
              <View>
                <Text className="text-base font-bold text-on-surface">{sub.name}</Text>
                <Text className="text-sm text-on-surface-variant capitalize">{sub.billingCycle}</Text>
              </View>
            </View>
            <Text className="text-base font-bold text-primary">Rp {sub.cost.toLocaleString('id-ID')}</Text>
          </View>
        ))}

        {filtered.length === 0 && (
          <Text className="text-center text-on-surface-variant mt-4">Tidak ada langganan di kategori ini.</Text>
        )}
      </View>
    </>
  );
};

// ─── All Categories Overview ───────────────────────────────
const AllCategoriesView = ({ subscriptions }: { subscriptions: any[] }) => {
  const totalCost = useMemo(
    () => subscriptions.reduce((sum, sub) => sum + sub.cost, 0),
    [subscriptions],
  );

  const categories = useMemo(() => {
    const catMap: Record<string, { cost: number; count: number }> = {};
    subscriptions.forEach(sub => {
      const cat = sub.category || 'Lainnya';
      if (!catMap[cat]) catMap[cat] = { cost: 0, count: 0 };
      catMap[cat].cost += sub.cost;
      catMap[cat].count += 1;
    });
    return Object.entries(catMap)
      .map(([name, data]) => ({
        name,
        ...data,
        percentage: totalCost > 0 ? Math.round((data.cost / totalCost) * 100) : 0,
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [subscriptions, totalCost]);

  const router = useRouter();

  return (
    <>
      {/* Overview Card */}
      <View className="mb-8 items-center">
        <View className="mb-4 rounded-3xl bg-secondary-container/20 p-6">
          <MaterialIcons name="analytics" size={48} color={colors.secondary.DEFAULT} />
        </View>
        <Text className="text-2xl font-bold text-on-surface">Semua Kategori</Text>
        <Text className="mt-2 text-xl font-extrabold text-primary">Rp {totalCost.toLocaleString('id-ID')}</Text>
        <Text className="text-sm font-medium text-on-surface-variant">Total pengeluaran bulanan</Text>
      </View>

      <Text className="mb-4 font-headline text-lg font-bold text-on-surface">Rincian Kategori</Text>
      <View className="gap-3 mb-10">
        {categories.map(cat => (
          <Pressable
            key={cat.name}
            className="rounded-2xl bg-surface-container-low p-4 active:opacity-70"
            onPress={() => router.push({ pathname: '/(tabs)/reports/details', params: { category: cat.name } })}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="rounded-full bg-primary/10 p-3">
                  <MaterialIcons name={getCategoryIcon(cat.name)} size={24} color={colors.primary.DEFAULT} />
                </View>
                <View>
                  <Text className="text-base font-bold text-on-surface">{cat.name}</Text>
                  <Text className="text-sm text-on-surface-variant">{cat.count} langganan</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-base font-bold text-primary">Rp {cat.cost.toLocaleString('id-ID')}</Text>
                <Text className="text-sm font-medium text-on-surface-variant">{cat.percentage}%</Text>
              </View>
            </View>

            {/* Progress bar */}
            <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary-container/30">
              <View className="h-full rounded-full bg-primary" style={{ width: `${cat.percentage}%` }} />
            </View>
          </Pressable>
        ))}

        {categories.length === 0 && (
          <Text className="text-center text-on-surface-variant mt-4">Belum ada data langganan.</Text>
        )}
      </View>
    </>
  );
};

// ─── Main Screen ───────────────────────────────────────────
const CategoryDetailsScreen = () => {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { subscriptions } = useSubscriptionStore();

  const categoryName = Array.isArray(category) ? category[0] : category;
  const isOverview = !categoryName;

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row items-center justify-between px-4 pb-4 pt-14 bg-surface">
        <Pressable onPress={() => router.back()} className="rounded-full bg-surface-container-highest p-2">
          <MaterialIcons name="arrow-back" size={24} color={colors['on-background']} />
        </Pressable>
        <Text className="text-lg font-bold text-on-surface">
          {isOverview ? 'Semua Analitik' : 'Detail Kategori'}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 pt-4">
        {isOverview ? (
          <AllCategoriesView subscriptions={subscriptions} />
        ) : (
          <SingleCategoryView categoryName={categoryName} subscriptions={subscriptions} />
        )}
      </ScrollView>
    </View>
  );
};

export default CategoryDetailsScreen;
