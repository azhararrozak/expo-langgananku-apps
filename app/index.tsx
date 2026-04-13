import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../utils/color';

/**
 * Entry point aplikasi (index screen)
 * ====================================
 * Halaman ini berfungsi sebagai:
 * 1. Splash/loading screen saat data dari AsyncStorage belum siap
 * 2. Router awal yang mengarahkan user ke halaman yang tepat menggunakan `Redirect`
 *
 * Menggunakan declarative routing `<Redirect />` terhindar dari error navigasi sebelum pemasangan (mounting).
 */
export default function Index() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface.DEFAULT }}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}
