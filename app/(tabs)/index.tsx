import { View, Text, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { colors } from '../../utils/color';

export default function HomeScreen() {
  return (
    // <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <View className="flex-col items-center gap-4 rounded-xl p-4">
        <View className="w-full overflow-hidden rounded-[30px]">
          <LinearGradient
            colors={[colors.primary.DEFAULT, colors.primary.container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-full p-6">
            <Text className="mb-2 font-label text-sm font-medium uppercase tracking-wide text-white opacity-80">
              Total Bulanan Ini
            </Text>
            <Text className="mb-6 font-headline text-4xl font-extrabold tracking-tight text-white">
              Rp 100.000
            </Text>
            <View className="w-full flex-row gap-2">
              <View className="w-1/2 flex-col items-center  justify-center rounded-xl bg-white/10 p-2 backdrop-blur-md">
                <MaterialIcons name="warning" size={24} color="yellow" />
                <Text className="my-2 text-center text-sm font-bold uppercase text-white">
                  3 Langganan Segera Berakhir
                </Text>
              </View>
              <View className="w-1/2 flex-col items-center justify-center rounded-xl bg-white/10 p-2 backdrop-blur-md">
                <AntDesign name="rise" size={24} color="yellow" />
                <Text className="my-2 text-center text-sm font-bold uppercase text-white">
                  Paling Mahal! Netflix
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="w-full">
          <View className="flex-row items-center justify-between">
            <Text className="text-on-surface font-headline text-lg font-bold">
              Tren Pengeluaran
            </Text>
            <View className="flex-row items-center gap-2 rounded-full bg-primary-fixed pl-2">
              <Text className="text-sm font-bold uppercase text-primary">6 Bulan Terakhir</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#757684" />
            </View>
          </View>
          <View className="mt-3 w-full overflow-hidden rounded-[2rem] bg-surface-container-lowest p-6">
            {/* Chart */}
            <View className="h-40 w-full flex-row items-end justify-between gap-1 px-2">
              {/* Jan */}
              <View className="flex-1 items-center">
                <View className="h-24 w-1.5 overflow-hidden rounded-full bg-slate-100">
                  <View className="absolute bottom-0 h-12 w-full rounded-full bg-secondary-fixed-dim" />
                </View>
                <Text className="mt-2 text-[10px] font-medium text-on-surface-variant">Jan</Text>
              </View>
              {/* Feb */}
              <View className="flex-1 items-center">
                <View className="h-24 w-1.5 overflow-hidden rounded-full bg-slate-100">
                  <View className="absolute bottom-0 h-16 w-full rounded-full bg-secondary-fixed-dim" />
                </View>
                <Text className="mt-2 text-[10px] font-medium text-on-surface-variant">Feb</Text>
              </View>
              {/* Mar */}
              <View className="flex-1 items-center">
                <View className="h-24 w-1.5 overflow-hidden rounded-full bg-slate-100">
                  <View className="absolute bottom-0 h-20 w-full rounded-full bg-secondary-fixed-dim" />
                </View>
                <Text className="mt-2 text-[10px] font-medium text-on-surface-variant">Mar</Text>
              </View>
              {/* Apr */}
              <View className="flex-1 items-center">
                <View className="h-24 w-1.5 overflow-hidden rounded-full bg-slate-100">
                  <View className="absolute bottom-0 h-14 w-full rounded-full bg-secondary-fixed-dim" />
                </View>
                <Text className="mt-2 text-[10px] font-medium text-on-surface-variant">Apr</Text>
              </View>
              {/* Mei - Active */}
              <View className="flex-1 items-center">
                <View className="h-24 w-1.5 overflow-hidden rounded-full bg-slate-100">
                  <View className="absolute bottom-0 h-24 w-full rounded-full bg-primary-container" />
                </View>
                <Text className="mt-2 text-[10px] font-bold text-primary">Mei</Text>
              </View>
              {/* Jun */}
              <View className="flex-1 items-center">
                <View className="h-24 w-1.5 overflow-hidden rounded-full bg-slate-100">
                  <View className="absolute bottom-0 h-8 w-full rounded-full bg-slate-300" />
                </View>
                <Text className="mt-2 text-[10px] font-medium text-on-surface-variant">Jun</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Grid Cards */}
        <View className="w-full flex-row gap-4">
          {/* Paling Mahal */}
          <View className="aspect-square flex-1 justify-between rounded-3xl bg-surface-container-low p-5">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-fixed">
              <MaterialIcons name="payments" size={20} color={colors.primary.DEFAULT} />
            </View>
            <View>
              <Text className="text-xs font-medium text-on-surface-variant">Paling Mahal</Text>
              <Text className="mt-1 font-headline text-lg font-bold leading-tight">Rp 186.000</Text>
              <Text className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                Netflix Premium
              </Text>
            </View>
          </View>

          {/* Tagihan Terdekat */}
          <View className="aspect-square flex-1 justify-between rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <View className="flex-row items-start justify-between">
              <MaterialIcons name="event" size={24} color={colors.error.DEFAULT} />
              <View className="rounded-lg bg-error-container px-2 py-1">
                <Text className="text-[10px] font-bold text-on-error-container">Besok</Text>
              </View>
            </View>
            <View>
              <Text className="text-xs font-medium text-on-surface-variant">Tagihan Terdekat</Text>
              <Text className="mt-1 font-headline text-lg font-bold leading-tight">Spotify</Text>
              <Text className="text-[10px] font-medium text-on-surface-variant">Rp 54.990</Text>
            </View>
          </View>
        </View>

        {/* Aktivitas Terakhir */}
        <View className="w-full">
          <Text className="text-on-surface mb-4 font-headline text-lg font-bold">
            Aktivitas Terakhir
          </Text>
          <View className="gap-4">
            {/* Netflix */}
            <View className="flex-row items-center justify-between rounded-2xl bg-surface-container-lowest p-4">
              <View className="flex-row items-center gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <Image
                    source={{
                      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPoWetlrXIHAwlZ-3BFCmLs9CJUQN0GH_6x0jJRkXcIBLmo-1JT23Sl9SwQ_-MtsDPEXURgODeSE6B_zedjmjNjG5zmlrDmMkQ9t7vBSCRTOT2_TrGZPia7mp1tod6uk_2C6zHPXd1Dy331txCRoGoH65FcGCHpISxjZOxsvxvI1KvCc-rziCAGuufZgBtI7noJKhoP8-LlXnchvFPZEMaNEwFkNENb__yXpzCGH-r5t0LOpetMfq3A_7IG9ATCCAh-u94s1Dj5g0',
                    }}
                    className="h-6 w-6"
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text className="text-on-surface font-bold">Netflix</Text>
                  <Text className="text-xs text-on-surface-variant">Perpanjang 21 Mei</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-on-surface font-bold">Rp 186rb</Text>
                <Text className="text-[10px] font-bold uppercase text-secondary">Berlangganan</Text>
              </View>
            </View>

            {/* Disney+ */}
            <View className="flex-row items-center justify-between rounded-2xl bg-surface-container-lowest p-4">
              <View className="flex-row items-center gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <Image
                    source={{
                      uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQg4Y47J7XNHvDsvqohZfAXaiHRVJqlStiyYUqaKG0TkKGZITQW7TWhN3Xxu06H5kIizYLhzd0SLl_2zdqc11RE2KoT4bdYVB-w2mQt1dQx1E6Py6iDNus77jv-5gZmczE1R7kwQ3CW-rEcO2LGGW6eHKe3NkOczheHjKL-9sH6_sOf8GPEhYzfjKwOx0Ir-DrSDNyaPtnYF_U_S11PZopA6WLcykIF1haCWO7hwCq_Hmh_OrbdDHgjFpL4I2DmGSL2jq0NUS09to',
                    }}
                    className="h-6 w-6"
                    resizeMode="contain"
                  />
                </View>
                <View>
                  <Text className="text-on-surface font-bold">Disney+</Text>
                  <Text className="text-xs text-on-surface-variant">Perpanjang 24 Mei</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-on-surface font-bold">Rp 39rb</Text>
                <Text className="text-[10px] font-bold uppercase text-secondary">Berlangganan</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
}
