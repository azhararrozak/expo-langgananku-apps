import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';
import CustomHeader from '../../../components/CustomHeader';
import { useSubscriptionStore } from '../../../store/useSubscriptionStore';

const getCardStyle = (name: string): readonly [string, string, ...string[]] => {
  const n = name.toLowerCase();
  if (n.includes('netflix')) return ['#E50914', '#831010'];
  if (n.includes('spotify')) return ['#1DB954', '#121212'];
  if (n.includes('disney')) return ['#0B0F2C', '#1A3673'];
  if (n.includes('hbo')) return ['#5A058A', '#1F0230'];
  if (n.includes('youtube')) return ['#FF0000', '#590000'];
  return [colors.primary.DEFAULT, colors.primary.container];
}

const getCardIcon = (name: string): any => {
  const n = name.toLowerCase();
  if (n.includes('netflix') || n.includes('hbo') || n.includes('disney')) return 'movie';
  if (n.includes('spotify') || n.includes('music')) return 'music-note';
  if (n.includes('youtube')) return 'play-circle-filled';
  return 'stars';
}

const getUtilityIcon = (name: string): any => {
  const n = name.toLowerCase();
  if (n.includes('gym') || n.includes('fit')) return 'fitness-center';
  if (n.includes('cloud') || n.includes('drive') || n.includes('karya')) return 'cloud';
  if (n.includes('internet') || n.includes('wifi')) return 'wifi';
  return 'receipt-long';
}

const SubscriptionScreen = () => {
  const { subscriptions, isLoading, fetchSubscriptions } = useSubscriptionStore();

  useFocusEffect(
    React.useCallback(() => {
      fetchSubscriptions();
    }, [])
  );

  const entertainmentSubs = subscriptions.filter(sub => ['Hiburan', 'Musik'].includes(sub.category || ''));
  const utilitySubs = subscriptions.filter(sub => !['Hiburan', 'Musik'].includes(sub.category || ''));

  return (
    <View className="flex-1 bg-background">
      <CustomHeader title="Langgananku" />
      <ScrollView showsVerticalScrollIndicator={false}>
      <View className="w-full flex-col p-4">
        <Text className="mb-2 font-label text-sm uppercase tracking-widest text-on-surface-variant">
          Ringkasan Portofolio
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-on-surface w-[15rem] font-headline text-4xl font-extrabold tracking-tight">
          Langganan Aktif
        </Text>
        <Pressable onPress={() => router.push('/subscription/create')} className="bg-primary/10 p-2 rounded-full">
          <MaterialIcons name="add" size={24} color={colors.primary.DEFAULT} />
        </Pressable>
        </View>
      </View>

      {isLoading && subscriptions.length === 0 ? (
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} className="mt-10" />
      ) : (
        <>
          {/* Entertainment & Media */}
          {entertainmentSubs.length > 0 && (
            <View className="gap-6 px-4 pb-12">
              <Text className="px-1 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Hiburan & Media
              </Text>

              {entertainmentSubs.map((sub) => (
                <Pressable key={sub.id} onPress={() => router.push(`/subscription/${sub.id}`)}>
                  <View className="w-full overflow-hidden rounded-[2rem] shadow-xl">
                    <LinearGradient
                      colors={getCardStyle(sub.name)}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      className="relative h-56 w-full p-8"
                    >
                      {/* Background Icon */}
                      <View className="absolute right-0 top-0 p-8 opacity-20">
                        <MaterialIcons name={getCardIcon(sub.name)} size={80} color="white" />
                      </View>

                      {/* Card Content */}
                      <View className="z-10 flex-1 justify-between">
                        {/* Top Row */}
                        <View className="flex-row items-start justify-between">
                          <View className="rounded-lg bg-white/20 px-3 py-1">
                            <Text className="text-xs font-bold uppercase tracking-tighter text-white">
                              {sub.category || 'Media'}
                            </Text>
                          </View>
                          <View className="flex-row items-center justify-center p-1 rounded-md bg-white/20">
                             <Text className="text-[10px] uppercase font-bold text-white px-1">{sub.billingCycle}</Text>
                          </View>
                        </View>

                        {/* Bottom Content */}
                        <View>
                          <Text className="mb-4 font-mono text-2xl font-bold tracking-widest text-white">
                            Rp {sub.cost.toLocaleString('id-ID')}
                          </Text>
                          <View className="flex-row items-end justify-between">
                            <View className="gap-1 flex-1 pr-4">
                              <Text className="font-label text-[10px] uppercase tracking-widest text-white/70">
                                Langganan
                              </Text>
                              <Text className="font-headline text-sm font-bold text-white" numberOfLines={1}>
                                {sub.name.toUpperCase()}
                              </Text>
                            </View>
                            <View className="items-end gap-1">
                              <Text className="font-label text-[10px] uppercase tracking-widest text-white/70">
                                Jatuh Tempo
                              </Text>
                              <Text className="font-mono text-sm text-white">
                                {new Date(sub.nextBillingDate).toLocaleDateString('id-ID', { month: '2-digit', year: '2-digit' })}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Utilities & Services */}
          {utilitySubs.length > 0 && (
            <View className="gap-6 px-4 pb-12">
              <Text className="px-1 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Utilitas & Layanan
              </Text>

              <View className="flex-row flex-wrap gap-4 justify-between">
                {utilitySubs.map((sub) => (
                  <Pressable key={sub.id} onPress={() => router.push(`/subscription/${sub.id}`)} className="w-[48%]">
                    <View className="flex-1 rounded-2xl bg-white px-4 pb-6 pt-6 shadow-md border border-gray-50">
                      <View className="mb-4 items-center">
                        <MaterialIcons name={getUtilityIcon(sub.name)} size={28} color={colors.outline.DEFAULT} />
                        <Text className="mt-2 text-center font-headline text-base font-extrabold uppercase tracking-widest" numberOfLines={1}>
                          {sub.name}
                        </Text>
                        <Text className="text-[10px] uppercase text-on-surface-variant text-center">
                          {sub.category || 'Utility'}
                        </Text>
                      </View>

                      <View className="my-2 border-t border-dashed border-outline-variant/50" />

                      <View className="gap-2 mt-2">
                        <View className="flex-col pb-2 border-b border-gray-100 items-center">
                           <Text className="font-mono text-[10px] text-gray-500 mb-1">{sub.billingCycle.toUpperCase()}</Text>
                           <Text className="font-bold text-primary text-sm">
                             Rp {sub.cost.toLocaleString('id-ID')}
                           </Text>
                        </View>
                        
                        <View className="mt-1 items-center">
                           <Text className="text-[9px] uppercase font-bold text-on-surface-variant">Pembayaran Berikutnya</Text>
                           <Text className="font-mono text-xs font-bold text-gray-700 mt-1">
                             {new Date(sub.nextBillingDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {subscriptions.length === 0 && !isLoading && (
            <View className="px-4 mt-6 items-center">
              <MaterialIcons name="inbox" size={48} color={colors.outline.variant} />
              <Text className="mt-4 text-center text-on-surface-variant text-base">
                Belum ada langganan yang ditambahkan.
              </Text>
              <Pressable onPress={() => router.push('/subscription/create')} className="mt-4 rounded-full bg-primary px-6 py-3">
                <Text className="text-white font-bold">Tambah Sekarang</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </ScrollView>
    </View>
  );
};

export default SubscriptionScreen;

