import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';

export default function AboutScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="flex-col p-6 items-center">
        <View className="h-24 w-24 bg-primary-container rounded-3xl justify-center items-center mb-6 mt-4">
           <MaterialIcons name="info" size={48} color={colors.primary.DEFAULT} />
        </View>
        <Text className="font-headline text-2xl font-extrabold text-on-surface mb-2">
          Langgananku Apps
        </Text>
        <Text className="text-on-surface-variant text-base font-medium mb-8">
          Versi 1.0.0
        </Text>

        <View className="bg-surface-container-low rounded-3xl p-6 w-full shadow-sm mb-6">
          <Text className="text-on-surface font-medium leading-relaxed">
            Langgananku adalah aplikasi pencatat langganan yang didesain khusus untuk memudahkanmu mengatur keuangan dari layanan digital. Dengan antarmuka yang bersih dan analitik yang rapi, pengguna dapat mengurangi tagihan biaya diam-diam (hidden cost) yang tidak disengaja!
          </Text>
        </View>
        
        <Text className="text-on-surface-variant text-sm mt-4">
          © 2026 Developer Langgananku.
        </Text>
      </View>
    </ScrollView>
  );
}
