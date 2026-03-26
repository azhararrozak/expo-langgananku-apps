import { Stack } from 'expo-router';
import { colors } from '../../../utils/color';

export default function SubscriptionLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface.DEFAULT },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="create" options={{ headerShown: true, headerTitle: 'Tambah Langganan' }} />
      <Stack.Screen name="[id]" options={{ headerShown: true, headerTitle: 'Detail Langganan' }} />
    </Stack>
  );
}
