import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../store/useAuthStore';
import { colors } from '../utils/color';

import '../global.css';

// Prevent the splash screen from auto-hiding until our navigation completes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Re-apply immersive mode when routes change. 
      // Keyboard interactions during login often force the Android stock nav bar to reappear.
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, [segments]);

  useEffect(() => {
    // Wait until navigation state is fully mounted
    if (!navigationState?.key || !isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';

    // We use setTimeout to defer the imperative navigation slightly
    // This perfectly avoids the "Attempted to navigate before mounting" error
    const timeout = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)/onboarding');
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      }
      
      // Hide splash screen after our logic executes
      SplashScreen.hideAsync();
    }, 10);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isHydrated, segments, navigationState?.key]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface.DEFAULT },
        }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
