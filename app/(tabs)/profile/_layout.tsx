import { Stack } from 'expo-router';
import { colors } from '../../../utils/color';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.surface.DEFAULT },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerBackVisible: false,
          headerTitle: 'Profile',
          headerStyle: { backgroundColor: colors.surface.DEFAULT },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          headerShown: true,
          headerTitle: 'Tentang Kami',
          headerStyle: { backgroundColor: colors.surface.DEFAULT },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
      <Stack.Screen
        name="privacypolicy"
        options={{
          headerShown: true,
          headerTitle: 'Kebijakan Privasi',
          headerStyle: { backgroundColor: colors.surface.DEFAULT },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
    </Stack>
  );
}
