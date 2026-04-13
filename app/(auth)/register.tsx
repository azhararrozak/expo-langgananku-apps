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

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register, isLoading, clearError } = useAuthStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // ── Validasi input ──────────────────────────
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Semua field harus diisi');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Perhatian', 'Kata sandi tidak cocok');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Perhatian', 'Kata sandi minimal 6 karakter');
      return;
    }

    try {
      // Register ke backend: POST /api/auth/signup
      // Body: { username, email, password }
      await register({ username, email, password });

      // ✅ Register sukses!
      // Backend TIDAK auto-login, jadi redirect ke halaman login
      Alert.alert(
        'Registrasi Berhasil! 🎉',
        'Akun kamu berhasil dibuat. Silakan login untuk melanjutkan.',
        [
          {
            text: 'Login Sekarang',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (err) {
      // Error yang mungkin dari backend:
      // - "Failed! Username is already in use!"
      // - "Failed! Email is already in use!"
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan, coba lagi';
      Alert.alert('Registrasi Gagal', message);
      clearError();
    }
  };

  const handleGoToLogin = () => {
    router.back();
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
            colors={[colors.secondary.DEFAULT, colors.secondary.container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="items-center px-8 pb-12"
            style={{ paddingTop: insets.top + 24 }}
          >
            {/* Back Button */}
            <Pressable
              onPress={handleGoToLogin}
              className="absolute left-6"
              style={{ top: insets.top + 12 }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>

            <View className="mb-4 items-center justify-center rounded-3xl bg-white/20 p-5">
              <MaterialIcons name="person-add" size={40} color="#ffffff" />
            </View>
            <Text className="mb-2 font-headline text-3xl font-extrabold text-white">
              Buat Akun Baru
            </Text>
            <Text className="text-center font-body text-base text-white/80">
              Mulai kelola semua langgananmu sekarang
            </Text>
          </LinearGradient>
        </View>

        {/* Form Section */}
        <View className="flex-1 justify-between px-8 pt-10">
          <View className="gap-4">
            {/* Username — harus unik di backend */}
            <AuthInput
              icon="person-outline"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            {/* Email — harus unik di backend */}
            <AuthInput
              icon="email"
              placeholder="Alamat Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthInput
              icon="lock-outline"
              placeholder="Kata Sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <AuthInput
              icon="lock"
              placeholder="Konfirmasi Kata Sandi"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            {/* Register Button */}
            <View className="mt-4">
              {isLoading ? (
                <View className="items-center py-4">
                  <ActivityIndicator size="small" color={colors.secondary.DEFAULT} />
                </View>
              ) : (
                <AuthButton title="Daftar" onPress={handleRegister} />
              )}
            </View>

            {/* Divider */}
            <View className="my-2 flex-row items-center gap-4">
              <View className="h-px flex-1 bg-outline-variant" />
              <Text className="font-body text-xs text-on-surface-variant">atau</Text>
              <View className="h-px flex-1 bg-outline-variant" />
            </View>

            {/* Social Register Button */}
            <Pressable
              className="flex-row items-center justify-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest py-3.5"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <MaterialIcons name="public" size={22} color={colors.outline.DEFAULT} />
              <Text className="font-headline text-sm font-bold text-on-background">
                Daftar dengan Google
              </Text>
            </Pressable>
          </View>

          {/* Login Link */}
          <View
            className="flex-row items-center justify-center gap-1 py-4"
            style={{ paddingBottom: insets.bottom + 8 }}
          >
            <Text className="font-body text-sm text-on-surface-variant">Sudah punya akun?</Text>
            <Pressable onPress={handleGoToLogin}>
              <Text className="font-headline text-sm font-bold text-primary">Masuk</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
