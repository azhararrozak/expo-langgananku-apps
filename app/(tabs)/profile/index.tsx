import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Konfirmasi Logout',
      'Apakah Anda yakin ingin keluar dari akun?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Keluar', 
          style: 'destructive', 
          onPress: () => logout()
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 p-6">
        <Text className="mb-6 text-3xl font-bold text-gray-900">Profile</Text>

        <View className="items-center mb-8 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-blue-100">
            <Text className="text-4xl font-bold text-blue-600">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          
          <Text className="mb-1 text-2xl font-bold text-gray-900">
            {user?.username || 'Username'}
          </Text>
          <Text className="mb-2 text-base text-gray-500">
            {user?.email || 'email@example.com'}
          </Text>

          {/* Menampilkan level role dari auth (misal: "User") */}
          <View className="flex-row items-center rounded-full bg-blue-50 px-4 py-2 mt-2">
            <Feather name="shield" size={14} color="#2563EB" />
            <Text className="ml-2 text-sm font-medium text-blue-700 capitalize">
              {user?.roles?.[0]?.replace('ROLE_', '')?.toLowerCase() || 'User'}
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center justify-center rounded-2xl bg-red-50 py-4 px-6 mt-4 opacity-90 active:opacity-100"
        >
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text className="ml-2 text-lg font-semibold text-red-500">
            Keluar dari Akun
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
