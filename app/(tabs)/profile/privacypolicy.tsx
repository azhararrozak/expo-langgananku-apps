import { View, Text, ScrollView } from 'react-native';
import React from 'react';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="flex-col p-6">
        <Text className="font-headline text-3xl font-extrabold text-on-surface mb-6">
          Kebijakan Privasi
        </Text>

        <View className="bg-surface-container-low rounded-[2rem] p-6 w-full shadow-sm">
          <Text className="font-bold text-lg text-on-surface mb-2">
            1. Pengumpulan Data
          </Text>
          <Text className="text-on-surface-variant font-medium leading-relaxed mb-6">
            Aplikasi Langgananku mengumpulkan data berupa email, detail berlangganan (harga, tanggal, kategori) yang diinputkan pengguna. Data ini secara eksklusif diperlukan agar aplikasi dapat memberikan perhitungan dan pengingat yang akurat. 
          </Text>

          <Text className="font-bold text-lg text-on-surface mb-2">
            2. Keamanan Data
          </Text>
          <Text className="text-on-surface-variant font-medium leading-relaxed mb-6">
            Kami menjaga keamanan akun Anda dengan enkripsi sandi terkini di dalam database MongoDB kami. Tidak ada perantara ketiga yang menjualbelikan data berlangganan pengeluaran Anda.
          </Text>

          <Text className="font-bold text-lg text-on-surface mb-2">
            3. Penghapusan Akun
          </Text>
          <Text className="text-on-surface-variant font-medium leading-relaxed">
            Anda berhak penuh untuk menghapus akun dan seluruh histori berlangganan dari sistem kami dalam menu pengaturan profil yang tersedia.
          </Text>
        </View>
        
        <Text className="text-center text-on-surface-variant text-xs mt-8 font-medium">
          Terakhir diperbarui: April 2026
        </Text>
      </View>
    </ScrollView>
  );
}
