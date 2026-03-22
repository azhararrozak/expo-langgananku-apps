import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-6">
      <Text className="mb-3 text-5xl">👤</Text>
      <Text className="mb-2 text-3xl font-bold text-gray-900">Profile</Text>
      <Text className="text-base text-gray-500">Halaman profil kamu</Text>
    </View>
  );
}
