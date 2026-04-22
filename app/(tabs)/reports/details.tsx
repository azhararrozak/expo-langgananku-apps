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

const CategoryDetailsScreen = () => {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { subscriptions } = useSubscriptionStore();

  const categoryName = Array.isArray(category) ? category[0] : category;

  const categorySubscriptions = useMemo(() => {
    if (!categoryName) return [];
    return subscriptions.filter(sub => (sub.category || 'Lainnya') === categoryName);
  }, [subscriptions, categoryName]);

  const totalCost = useMemo(() => {
    return categorySubscriptions.reduce((sum, sub) => sum + sub.cost, 0);
  }, [categorySubscriptions]);

  return (
    <View className="flex-1 bg-surface">
      <View className="flex-row items-center justify-between px-4 pb-4 pt-14 bg-surface">
        <Pressable onPress={() => router.back()} className="rounded-full bg-surface-container-highest p-2">
          <MaterialIcons name="arrow-back" size={24} color={colors.onSurface.DEFAULT} />
        </Pressable>
        <Text className="text-lg font-bold text-on-surface">Detail Kategori</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 pt-4">
        <View className="mb-8 items-center">
           <View className="mb-4 rounded-3xl bg-secondary-container/20 p-6">
             <MaterialIcons name={getCategoryIcon(categoryName)} size={48} color={colors.secondary.DEFAULT} />
           </View>
           <Text className="text-2xl font-bold text-on-surface">{categoryName || 'Unknown Category'}</Text>
           <Text className="mt-2 text-xl font-extrabold text-primary">Rp {totalCost.toLocaleString('id-ID')}</Text>
           <Text className="text-sm font-medium text-on-surface-variant">Total per bulan</Text>
        </View>

        <Text className="mb-4 font-headline text-lg font-bold text-on-surface">Daftar Langganan</Text>
        <View className="gap-3 mb-10">
          {categorySubscriptions.map(sub => (
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

          {categorySubscriptions.length === 0 && (
             <Text className="text-center text-on-surface-variant mt-4">Tidak ada langganan di kategori ini.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryDetailsScreen;
