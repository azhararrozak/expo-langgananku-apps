import { View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="flex-col gap-6 p-4">
        {/* Header */}
        <View className="items-center gap-3">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed">
            <MaterialIcons name="subscriptions" size={32} color={colors.primary.DEFAULT} />
          </View>
          <Text className="font-headline text-2xl font-extrabold">Subscription #{id}</Text>
          <View className="rounded-full bg-secondary-fixed px-3 py-1">
            <Text className="text-xs font-bold uppercase text-secondary">Active</Text>
          </View>
        </View>

        {/* Detail Card */}
        <View className="gap-4 rounded-2xl bg-surface-container-lowest p-5">
          <Text className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            Detail Langganan
          </Text>

          <View className="gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-on-surface-variant">Nama</Text>
              <Text className="text-sm font-bold">-</Text>
            </View>
            <View className="border-t border-dashed border-outline-variant" />

            <View className="flex-row justify-between">
              <Text className="text-sm text-on-surface-variant">Kategori</Text>
              <Text className="text-sm font-bold">-</Text>
            </View>
            <View className="border-t border-dashed border-outline-variant" />

            <View className="flex-row justify-between">
              <Text className="text-sm text-on-surface-variant">Biaya</Text>
              <Text className="text-sm font-bold">-</Text>
            </View>
            <View className="border-t border-dashed border-outline-variant" />

            <View className="flex-row justify-between">
              <Text className="text-sm text-on-surface-variant">Siklus</Text>
              <Text className="text-sm font-bold">Bulanan</Text>
            </View>
            <View className="border-t border-dashed border-outline-variant" />

            <View className="flex-row justify-between">
              <Text className="text-sm text-on-surface-variant">Perpanjang</Text>
              <Text className="text-sm font-bold">-</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3">
          <View className="items-center rounded-2xl bg-primary p-4">
            <Text className="text-sm font-bold uppercase text-on-primary">Edit Langganan</Text>
          </View>
          <View className="items-center rounded-2xl border border-error p-4">
            <Text className="text-sm font-bold uppercase text-error">Hapus Langganan</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
