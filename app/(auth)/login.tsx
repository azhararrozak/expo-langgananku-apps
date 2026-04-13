import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../utils/color';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login, isLoading, clearError } = useAuthStore();

  // ⚠️ Backend login menggunakan USERNAME, bukan email!
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Username dan kata sandi tidak boleh kosong');
      return;
    }

    try {
      await login({ username, password });
      // Redirect otomatis dilakukan oleh useProtectedRoute di _layout.tsx
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi';
      Alert.alert('Login Gagal', message);
      clearError();
    }
  };

  const handleGoToRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        className="flex-1 bg-surface"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Gradient Section */}
        <View className="overflow-hidden rounded-b-[40px]">
          <LinearGradient
            colors={[colors.primary.DEFAULT, colors.primary.container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="items-center px-8 pb-12"
            style={{ paddingTop: insets.top + 24 }}
          >
            <View className="mb-4 items-center justify-center rounded-3xl bg-white/20 p-5">
              <MaterialIcons name="lock-open" size={40} color="#ffffff" />
            </View>
            <Text className="mb-2 font-headline text-3xl font-extrabold text-white">
              Selamat Datang
            </Text>
            <Text className="text-center font-body text-base text-white/80">
              Masuk untuk kelola langgananmu
            </Text>
          </LinearGradient>
        </View>

        {/* Form Section */}
        <View className="flex-1 justify-between px-8 pt-10">
          <View className="gap-4">
            {/* Username Input (bukan email!) */}
            <AuthInput
              icon="person"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <AuthInput
              icon="lock-outline"
              placeholder="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Forgot Password */}
            <Pressable className="self-end">
              <Text className="font-body text-sm font-semibold text-primary">Lupa kata sandi?</Text>
            </Pressable>

            {/* Login Button */}
            <View className="mt-4">
              {isLoading ? (
                <View className="items-center py-4">
                  <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                </View>
              ) : (
                <AuthButton title="Masuk" onPress={handleLogin} />
              )}
            </View>

            {/* Divider */}
            <View className="my-2 flex-row items-center gap-4">
              <View className="h-px flex-1 bg-outline-variant" />
              <Text className="font-body text-xs text-on-surface-variant">atau</Text>
              <View className="h-px flex-1 bg-outline-variant" />
            </View>

            {/* Social Login Buttons */}
            <Pressable
              className="flex-row items-center justify-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest py-3.5"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <MaterialIcons name="public" size={22} color={colors.outline.DEFAULT} />
              <Text className="font-headline text-sm font-bold text-on-background">
                Lanjutkan dengan Google
              </Text>
            </Pressable>
          </View>

          {/* Register Link */}
          <View
            className="flex-row items-center justify-center gap-1 py-4"
            style={{ paddingBottom: insets.bottom + 8 }}
          >
            <Text className="font-body text-sm text-on-surface-variant">Belum punya akun?</Text>
            <Pressable onPress={handleGoToRegister}>
              <Text className="font-headline text-sm font-bold text-primary">Daftar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
