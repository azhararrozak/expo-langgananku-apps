import { useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OnboardingSlide, { OnboardingSlideData } from '../../components/onboarding/OnboardingSlide';
import PaginationDots from '../../components/onboarding/PaginationDots';
import AuthButton from '../../components/auth/AuthButton';
import { colors } from '../../utils/color';

const slides: OnboardingSlideData[] = [
  {
    id: '1',
    icon: 'subscriptions',
    title: 'Kelola Semua Langgananmu',
    description:
      'Pantau semua layanan berlangganan dalam satu tempat. Tidak ada lagi tagihan yang terlewat!',
    gradientColors: [colors.primary.DEFAULT, colors.primary.container],
  },
  {
    id: '2',
    icon: 'notifications-active',
    title: 'Pengingat Otomatis',
    description:
      'Dapatkan notifikasi sebelum tagihan jatuh tempo. Hemat uang dengan menghentikan langganan yang tidak perlu.',
    gradientColors: [colors.secondary.DEFAULT, colors.secondary.container],
  },
  {
    id: '3',
    icon: 'insights',
    title: 'Analisis Pengeluaran',
    description:
      'Lihat laporan lengkap pengeluaran langgananmu. Ambil keputusan yang lebih cerdas.',
    gradientColors: [colors.tertiary.DEFAULT, colors.tertiary.container],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const isLastSlide = activeIndex === slides.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const handleNext = () => {
    if (isLastSlide) {
      router.replace('/(auth)/login');
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      {/* Skip Button */}
      <View className="flex-row justify-end px-6 py-3">
        <Pressable
          onPress={handleSkip}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text className="font-headline text-sm font-bold text-primary">Lewati</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OnboardingSlide data={item} />}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        className="flex-1"
      />

      {/* Bottom Section */}
      <View className="px-8 pb-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <PaginationDots total={slides.length} activeIndex={activeIndex} />

        <View className="mt-8">
          <AuthButton title={isLastSlide ? 'Mulai Sekarang' : 'Lanjut'} onPress={handleNext} />
        </View>
      </View>
    </View>
  );
}
