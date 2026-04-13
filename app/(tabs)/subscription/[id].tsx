import { View, Text, ScrollView, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';
import { useSubscriptionStore } from '../../../store/useSubscriptionStore';
import { useEffect, useState } from 'react';

export default function SubscriptionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedSubscription, isLoading, fetchSubscriptionById, removeSubscription, clearSelected } = useSubscriptionStore();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSubscriptionById(id);
    }
    return () => {
      // Clear data when unmounting so previous data isn't shown momentarily on next visit
      clearSelected();
    };
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Hapus Langganan',
      'Apakah Anda yakin ingin menghapus langganan ini? Data tidak dapat dikembalikan.',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await removeSubscription(id);
              router.back();
            } catch (error) {
              Alert.alert('Gagal', 'Tidak dapat menghapus langganan. Silahkan coba lagi.');
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  if (isLoading && !selectedSubscription) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
        <Text className="mt-4 text-on-surface-variant font-medium">Memuat rincian...</Text>
      </View>
    );
  }

  if (!selectedSubscription) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <MaterialIcons name="error-outline" size={48} color={colors.outline.DEFAULT} />
        <Text className="text-on-surface-variant text-base mt-4 font-medium">Langganan tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="flex-col gap-6 p-4 mt-2">
        {/* Header */}
        <View className="items-center gap-3">
          <View className="h-20 w-20 items-center justify-center rounded-3xl bg-primary-fixed shadow-sm">
            <MaterialIcons name="card-membership" size={40} color={colors.primary.DEFAULT} />
          </View>
          <Text className="font-headline text-3xl font-extrabold text-on-surface text-center">
            {selectedSubscription.name}
          </Text>
          <View className={`rounded-full px-5 py-1.5 ${selectedSubscription.status === 'active' ? 'bg-secondary-fixed-dim' : 'bg-surface-container-highest'}`}>
            <Text className={`text-sm font-bold uppercase tracking-widest ${selectedSubscription.status === 'active' ? 'text-secondary' : 'text-on-surface-variant'}`}>
              {selectedSubscription.status}
            </Text>
          </View>
        </View>

        {/* Detail Card */}
        <View className="gap-5 rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-outline-variant/10">
          <Text className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
            Detail Informasi
          </Text>

          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-on-surface-variant">Kategori</Text>
              <Text className="text-sm font-bold">{selectedSubscription.category || '-'}</Text>
            </View>
            <View className="border-t border-dashed border-outline-variant/30" />

            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-on-surface-variant">Biaya Tagihan</Text>
              <Text className="text-lg font-bold text-primary">Rp {selectedSubscription.cost.toLocaleString('id-ID')}</Text>
            </View>
            <View className="border-t border-dashed border-outline-variant/30" />

            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-on-surface-variant">Siklus</Text>
              <Text className="text-sm font-bold uppercase tracking-wider">{selectedSubscription.billingCycle}</Text>
            </View>
            <View className="border-t border-dashed border-outline-variant/30" />

            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-on-surface-variant">Perpanjangan Berikutnya</Text>
              <Text className="text-sm font-bold">
                {new Date(selectedSubscription.nextBillingDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3 mt-4">
          <Pressable className="items-center rounded-2xl bg-primary-fixed p-4 active:opacity-80">
            <Text className="text-sm font-bold uppercase text-primary">Edit Langganan</Text>
          </Pressable>
          
          <Pressable 
            onPress={handleDelete}
            disabled={isDeleting}
            className={`items-center rounded-2xl border border-error p-4 active:bg-error-container ${isDeleting ? 'opacity-50' : ''}`}
          >
            {isDeleting ? (
              <ActivityIndicator color={colors.error.DEFAULT} size="small" />
            ) : (
              <Text className="text-sm font-bold uppercase text-error">Hapus Langganan</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
