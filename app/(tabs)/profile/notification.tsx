import { View, Text, Switch, Linking, TouchableOpacity, ScrollView, AppState } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';

export default function NotificationScreen() {
  const [isGranted, setIsGranted] = useState(false);
  const [globalNotifEnabled, setGlobalNotifEnabled] = useState(true);
  const appState = useRef(AppState.currentState);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setIsGranted(status === 'granted');
  };

  useEffect(() => {
    checkPermissions();

    const subscription = AppState.addEventListener('change', nextAppState => {
      // Refresh permission status when coming back from background/settings
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        checkPermissions();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const openSettings = () => {
    Linking.openSettings();
  };

  return (
    <ScrollView className="flex-1 bg-surface" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-6">
        
        {/* Device Permission Status */}
        <View className="mb-6 rounded-2xl bg-surface-container-low p-5">
          <View className="mb-4 flex-row items-center gap-3">
            <View className={`h-12 w-12 items-center justify-center rounded-full ${isGranted ? 'bg-green-100' : 'bg-red-100'}`}>
              <MaterialIcons 
                name={isGranted ? "notifications-active" : "notifications-off"} 
                size={24} 
                color={isGranted ? "#16a34a" : "#dc2626"} 
              />
            </View>
            <View>
              <Text className="text-base font-bold text-on-surface">Izin Sistem Perangkat</Text>
              <Text className={`text-sm font-medium ${isGranted ? 'text-green-600' : 'text-red-600'}`}>
                {isGranted ? 'Diizinkan' : 'Ditolak / Belum Diizinkan'}
              </Text>
            </View>
          </View>

          {!isGranted && (
            <>
              <Text className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                Kamu perlu mengaktifkan izin notifikasi di pengaturan perangkat agar aplikasi dapat mengirimkan pengingat jatuh tempo.
              </Text>
              <TouchableOpacity 
                onPress={openSettings}
                className="items-center justify-center rounded-xl bg-primary py-3.5 active:opacity-90"
              >
                <Text className="font-bold text-white">Buka Pengaturan HP</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* In-App Preferences */}
        <Text className="mb-3 pl-1 text-sm font-bold uppercase tracking-wider text-on-surface-variant">
          Preferensi Aplikasi
        </Text>
        <View className="rounded-2xl bg-surface-container-low">
          <View className="flex-row items-center justify-between p-5">
            <View className="flex-1 pr-4">
              <Text className="mb-1 text-base font-bold text-on-surface">Peringatan Jatuh Tempo</Text>
              <Text className="text-sm leading-relaxed text-on-surface-variant">
                Dapatkan notifikasi 2 hari sebelum tanggal tagihan langgananmu pada jam 09:00 pagi.
              </Text>
            </View>
            <Switch
              value={globalNotifEnabled}
              onValueChange={setGlobalNotifEnabled}
              trackColor={{ false: colors.outline.variant, true: colors.secondary.DEFAULT }}
              thumbColor="#ffffff"
            />
          </View>
          
          <View className="mx-5 h-[1px] bg-outline-variant/20" />
          
          <View className="flex-row items-center justify-between p-5 opacity-60">
            <View className="flex-1 pr-4">
              <Text className="mb-1 text-base font-bold text-on-surface">Ubah Waktu Pengingat</Text>
              <Text className="text-sm text-on-surface-variant">
                Saat ini: 09:00 Pagi (Segera Hadir)
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.outline.DEFAULT} />
          </View>
        </View>

      </View>
    </ScrollView>
  );
}