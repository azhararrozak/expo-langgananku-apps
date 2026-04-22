import { Stack } from 'expo-router';
import { colors } from '../../../utils/color';

export default function ReportsLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.surface.DEFAULT },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}