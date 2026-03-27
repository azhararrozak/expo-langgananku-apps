import { View, Text, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';

const SubscriptionScreen = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="w-full flex-col p-4">
        <Text className="mb-2 font-label text-sm uppercase tracking-widest text-on-surface-variant">
          Portofolio Overview
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-on-surface w-[15rem] font-headline text-4xl font-extrabold tracking-tight">
          Active Subscriptions
        </Text>
        <Pressable onPress={() => router.push('/subscription/create')}>
          <MaterialIcons name="add" size={24} color={colors.primary.DEFAULT} />
        </Pressable>
        </View>
      </View>

      {/* Entertainment & Media */}
      <View className="gap-6 px-4 pb-12">
        <Text className="px-1 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Entertainment & Media
        </Text>

        {/* Netflix Card */}
        <Pressable onPress={() => router.push('/subscription/netflix')}>
        <View className="w-full overflow-hidden rounded-[2rem] shadow-xl">
          <LinearGradient
            colors={['#E50914', '#831010']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="relative h-56 w-full p-8"
          >
            {/* Background Icon */}
            <View className="absolute right-0 top-0 p-8 opacity-20">
              <MaterialIcons name="movie" size={80} color="white" />
            </View>

            {/* Card Content */}
            <View className="z-10 flex-1 justify-between">
              {/* Top Row */}
              <View className="flex-row items-start justify-between">
                <View className="rounded-lg bg-white/20 px-3 py-1">
                  <Text className="text-xs font-bold uppercase tracking-tighter text-white">
                    Premium UHD
                  </Text>
                </View>
                <View className="h-8 w-12 rounded-md bg-yellow-400/80" />
              </View>

              {/* Bottom Content */}
              <View>
                <Text className="mb-4 font-mono text-xl tracking-[0.3em] text-white">
                  •••• •••• •••• 4012
                </Text>
                <View className="flex-row items-end justify-between">
                  <View className="gap-1">
                    <Text className="font-label text-[10px] uppercase tracking-widest text-white/70">
                      Cardholder
                    </Text>
                    <Text className="font-headline text-sm font-bold text-white">
                      ALEXANDER RIVERA
                    </Text>
                  </View>
                  <View className="items-end gap-1">
                    <Text className="font-label text-[10px] uppercase tracking-widest text-white/70">
                      Valid Thru
                    </Text>
                    <Text className="font-mono text-sm text-white">12/26</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
        </Pressable>

        {/* Spotify Card */}
        <View className="w-full overflow-hidden rounded-[2rem] shadow-xl">
          <LinearGradient
            colors={['#1DB954', '#121212']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="relative h-56 w-full p-8"
          >
            {/* Background Icon */}
            <View className="absolute right-0 top-0 p-8 opacity-20">
              <MaterialIcons name="music-note" size={80} color="white" />
            </View>

            {/* Card Content */}
            <View className="z-10 flex-1 justify-between">
              {/* Top Row */}
              <View className="flex-row items-start justify-between">
                <View className="rounded-lg bg-black/40 px-3 py-1">
                  <Text className="text-xs font-bold uppercase tracking-tighter text-white">
                    Family Plan
                  </Text>
                </View>
                <View className="h-8 w-12 items-center justify-center rounded-md bg-slate-300/60">
                  <View className="h-4 w-8 rounded border border-white/30" />
                </View>
              </View>

              {/* Bottom Content */}
              <View>
                <Text className="mb-4 font-mono text-xl tracking-[0.3em] text-white">
                  •••• •••• •••• 8892
                </Text>
                <View className="flex-row items-end justify-between">
                  <View className="gap-1">
                    <Text className="font-label text-[10px] uppercase tracking-widest text-white/70">
                      Cardholder
                    </Text>
                    <Text className="font-headline text-sm font-bold text-white">
                      ALEXANDER RIVERA
                    </Text>
                  </View>
                  <View className="items-end gap-1">
                    <Text className="font-label text-[10px] uppercase tracking-widest text-white/70">
                      Valid Thru
                    </Text>
                    <Text className="font-mono text-sm text-white">05/25</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Utilities & Services */}
      <View className="gap-8 px-4 pb-12">
        <Text className="px-1 font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">
          Utilities & Services
        </Text>

        <View className="flex-row gap-4">
          {/* Gym Receipt */}
          <View className="flex-1 rounded-2xl bg-white px-6 pb-10 pt-8 shadow-md">
            <View className="mb-6 items-center">
              <MaterialIcons name="fitness-center" size={28} color={colors.outline.DEFAULT} />
              <Text className="mt-2 font-headline text-lg font-extrabold uppercase tracking-widest">
                FITNESS FIRST
              </Text>
              <Text className="text-[10px] text-on-surface-variant">TRANS #99283-ID-2024</Text>
            </View>

            <View className="my-4 border-t border-dashed border-outline-variant" />

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="font-mono text-sm">MEMBERSHIP</Text>
                <Text className="font-mono text-sm">$45.00</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-mono text-sm">TAX (10%)</Text>
                <Text className="font-mono text-sm">$4.50</Text>
              </View>

              <View className="my-2 border-t border-dashed border-outline-variant" />

              <View className="flex-row justify-between">
                <Text className="text-base font-bold">TOTAL</Text>
                <Text className="text-base font-bold">$49.50</Text>
              </View>
            </View>

            <View className="mt-6 items-center">
              <Text className="font-mono text-[10px] uppercase text-on-surface-variant">
                Next Due: OCT 12, 2024
              </Text>
            </View>
          </View>

          {/* iCloud Receipt */}
          <View className="flex-1 rounded-2xl bg-white px-6 pb-10 pt-8 shadow-md">
            <View className="mb-6 items-center">
              <MaterialIcons name="cloud" size={28} color={colors.outline.DEFAULT} />
              <Text className="mt-2 font-headline text-lg font-extrabold uppercase tracking-widest">
                ICLOUD+ 2TB
              </Text>
              <Text className="text-[10px] text-on-surface-variant">INV #APPLE-2938-X</Text>
            </View>

            <View className="my-4 border-t border-dashed border-outline-variant" />

            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="font-mono text-sm">STORAGE</Text>
                <Text className="font-mono text-sm">$9.99</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="font-mono text-sm">VAT</Text>
                <Text className="font-mono text-sm">$0.00</Text>
              </View>

              <View className="my-2 border-t border-dashed border-outline-variant" />

              <View className="flex-row justify-between">
                <Text className="text-base font-bold">TOTAL</Text>
                <Text className="text-base font-bold">$9.99</Text>
              </View>
            </View>

            <View className="mt-6 items-center">
              <Text className="font-mono text-[10px] uppercase text-on-surface-variant">
                Next Due: OCT 21, 2024
              </Text>
            </View>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

export default SubscriptionScreen;

