import { Stack } from 'expo-router';
import { Image, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../../utils/color';

export default function SubscriptionLayout() {
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
          headerTitle: 'Langgananku',
          headerStyle: { backgroundColor: colors.surface.DEFAULT },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          headerLeft: () => (
            <Image
              source={require('../../../assets/icon.png')}
              style={{ width: 28, height: 28, marginRight: 8, borderRadius: 6 }}
              resizeMode="contain"
            />
          ),
          headerRight: () => (
            <Pressable style={{ marginRight: 16 }}>
              <MaterialIcons name="notifications-none" size={24} color={colors.outline.DEFAULT} />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerShown: true,
          headerTitle: 'Tambah Langganan',
          headerStyle: { backgroundColor: colors.surface.DEFAULT },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: true,
          headerTitle: 'Detail Langganan',
          headerStyle: { backgroundColor: colors.surface.DEFAULT },
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      />
    </Stack>
  );
}


