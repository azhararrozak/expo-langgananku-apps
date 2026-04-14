import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { colors } from '../../utils/color';
import { useEffect, useMemo, useState } from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { getMonthlySpending, MonthlySpendingData } from '../../services/dashboardService';

export default function HomeScreen() {
  const { subscriptions, fetchSubscriptions } = useSubscriptionStore();

  // Dashboard API Stats
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpendingData[]>([]);
  const [chartRange, setChartRange] = useState<3 | 6>(6);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    
    getMonthlySpending()
      .then(res => {
        if (res && res.data) setMonthlySpending(res.data);
      })
      .catch(console.error);
  }, []);

  const chartData = useMemo(() => {
    if (!monthlySpending.length) return [];
    return monthlySpending.slice(-chartRange);
  }, [monthlySpending, chartRange]);

  const maxSpending = useMemo(() => {
    if (!chartData.length) return 1;
    return Math.max(...chartData.map(d => d.total), 1);
  }, [chartData]);

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');

  const totalMonthlyCost = useMemo(() => {
    return activeSubscriptions.reduce((sum, sub) => {
      if (sub.billingCycle === 'yearly') return sum + (sub.cost / 12);
      return sum + sub.cost;
    }, 0);
  }, [activeSubscriptions]);

  const nearestSubscriptions = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [...activeSubscriptions]
      .filter(sub => new Date(sub.nextBillingDate).getTime() >= today.getTime())
      .sort((a, b) => {
         return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
      });
  }, [activeSubscriptions]);

  const nearestBilling = nearestSubscriptions.length > 0 ? nearestSubscriptions[0] : null;

  const soonExpiringCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return activeSubscriptions.filter(sub => {
      const billingDate = new Date(sub.nextBillingDate);
      return billingDate >= today && billingDate <= sevenDaysFromNow;
    }).length;
  }, [activeSubscriptions]);

  const mostExpensive = useMemo(() => {
    if (activeSubscriptions.length === 0) return null;
    return activeSubscriptions.reduce((prev, current) => {
      const currentCost = current.billingCycle === 'yearly' ? current.cost / 12 : current.cost;
      const prevCost = prev.billingCycle === 'yearly' ? prev.cost / 12 : prev.cost;
      return currentCost > prevCost ? current : prev;
    });
  }, [activeSubscriptions]);

  // formatter
  const formatCurrency = (amount: number) => {
    return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
  };

  const getRelativeDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hari Ini';
    if (diffDays === 1) return 'Besok';
    if (diffDays > 1) return `${diffDays} Hari`;
    if (diffDays < 0) return 'Terlewat';
    return '-';
  };

  const formatShortDate = (dateString: string) => {
    const d = new Date(dateString);
    return `Perpanjang ${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })}`;
  };

  return (
    // <SafeAreaView className="flex-1" edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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
              {formatCurrency(totalMonthlyCost)}
            </Text>
            <View className="w-full flex-row gap-2">
              <View className="w-1/2 flex-col items-center  justify-center rounded-xl bg-white/10 p-2 backdrop-blur-md">
                <MaterialIcons name="warning" size={24} color="yellow" />
                <Text className="my-2 text-center text-sm font-bold uppercase text-white">
                  {soonExpiringCount} Langganan Segera Berakhir
                </Text>
              </View>
              <View className="w-1/2 flex-col items-center justify-center rounded-xl bg-white/10 p-2 backdrop-blur-md">
                <AntDesign name="rise" size={24} color="yellow" />
                <Text className="my-2 text-center text-sm font-bold uppercase text-white">
                  Paling Mahal! {mostExpensive ? mostExpensive.name : '-'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="w-full z-10">
          <View className="flex-row items-center justify-between z-10">
            <Text className="text-on-surface font-headline text-lg font-bold">
              Tren Pengeluaran
            </Text>
            <View className="relative z-10">
               <Pressable 
                 onPress={() => setShowDropdown(!showDropdown)} 
                 className="flex-row items-center gap-2 rounded-full bg-primary-fixed pl-3 pr-1 py-1.5"
               >
                 <Text className="text-sm font-bold uppercase text-primary ml-1">{chartRange} Bulan Terakhir</Text>
                 <MaterialIcons name={showDropdown ? "arrow-drop-up" : "arrow-drop-down"} size={22} color={colors.primary.DEFAULT} />
               </Pressable>
               
               {showDropdown && (
                  <View className="absolute top-10 right-0 w-44 bg-surface-container-highest rounded-xl shadow-lg border border-outline-variant/30 z-50 overflow-hidden">
                     <Pressable 
                       onPress={() => { setChartRange(3); setShowDropdown(false); }} 
                       className="px-4 py-3 border-b border-outline-variant/10 active:bg-surface-container-highest"
                     >
                        <Text className="text-sm text-on-surface font-bold tracking-wide">3 Bulan Terakhir</Text>
                     </Pressable>
                     <Pressable 
                       onPress={() => { setChartRange(6); setShowDropdown(false); }} 
                       className="px-4 py-3 active:bg-surface-container-highest"
                     >
                        <Text className="text-sm text-on-surface font-bold tracking-wide">6 Bulan Terakhir</Text>
                     </Pressable>
                  </View>
               )}
            </View>
          </View>
          
          {/* Chart Wrapper - Lower z-index so dropdown appears over it */}
          <View className="mt-3 w-full overflow-hidden rounded-[2rem] bg-surface-container-lowest p-6 z-0">
            {chartData.length > 0 ? (
              <View className="h-40 w-full flex-row items-end justify-between gap-1 px-2">
                {chartData.map((data, index) => {
                  const isLast = index === chartData.length - 1;
                  const barHeight = (data.total / maxSpending) * 96; // 96 is roughly h-24
                  const shortLabel = data.label.split(' ')[0]; // Extract "Jan" from "Jan 2026"
                  
                  return (
                    <View key={`${data.year}-${data.month}`} className="flex-1 items-center">
                      <View className="h-24 w-1.5 overflow-hidden rounded-full bg-slate-100">
                        {/* the animated filled bar */}
                        <View 
                          style={{ height: Math.max(barHeight, 4) }} 
                          className={`absolute bottom-0 w-full rounded-full ${isLast ? 'bg-primary-container' : 'bg-secondary-fixed-dim'}`} 
                        />
                      </View>
                      <Text className={`mt-2 text-[10px] ${isLast ? 'font-bold text-primary' : 'font-medium text-on-surface-variant'}`}>
                        {shortLabel}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
               <View className="h-40 w-full justify-center items-center">
                  <Text className="text-on-surface-variant font-medium">Memuat data statistik...</Text>
               </View>
            )}
          </View>
        </View>

        {/* Grid Cards */}
        <View className="w-full flex-row gap-4 mt-2">
          {/* Paling Mahal */}
          <View className="aspect-square flex-1 justify-between rounded-3xl bg-surface-container-low p-5">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary-fixed">
              <MaterialIcons name="payments" size={20} color={colors.primary.DEFAULT} />
            </View>
            <View>
              <Text className="text-xs font-medium text-on-surface-variant">Paling Mahal</Text>
              <Text className="mt-1 font-headline text-lg font-bold leading-tight">
                {mostExpensive ? formatCurrency(mostExpensive.cost) : 'Rp 0'}
              </Text>
              <Text className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                {mostExpensive ? mostExpensive.name : '-'}
              </Text>
            </View>
          </View>

          {/* Tagihan Terdekat */}
          <View className="aspect-square flex-1 justify-between rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <View className="flex-row items-start justify-between">
              <MaterialIcons name="event" size={24} color={colors.error.DEFAULT} />
              <View className={`rounded-lg px-2 py-1 ${nearestBilling ? 'bg-error-container' : 'bg-surface-container-highest'}`}>
                <Text className={`text-[10px] font-bold ${nearestBilling ? 'text-on-error-container' : 'text-on-surface-variant'}`}>
                  {nearestBilling ? getRelativeDate(nearestBilling.nextBillingDate) : '-'}
                </Text>
              </View>
            </View>
            <View>
              <Text className="text-xs font-medium text-on-surface-variant">Tagihan Terdekat</Text>
              <Text className="mt-1 font-headline text-lg font-bold leading-tight">
                {nearestBilling ? nearestBilling.name : '-'}
              </Text>
              <Text className="text-[10px] font-medium text-on-surface-variant">
                {nearestBilling ? formatCurrency(nearestBilling.cost) : 'Rp 0'}
              </Text>
            </View>
          </View>
        </View>

        {/* Aktivitas Terakhir */}
        <View className="w-full">
          <Text className="text-on-surface mb-4 font-headline text-lg font-bold">
            Aktivitas Terakhir
          </Text>
          <View className="gap-4">
            {nearestSubscriptions.slice(0, 3).map((sub) => (
              <View key={sub.id} className="flex-row items-center justify-between rounded-2xl bg-surface-container-lowest p-4">
                <View className="flex-row items-center gap-4">
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                     <Text className="text-lg font-bold text-primary">
                       {sub.name.charAt(0).toUpperCase()}
                     </Text>
                  </View>
                  <View>
                    <Text className="text-on-surface font-bold">{sub.name}</Text>
                    <Text className="text-xs text-on-surface-variant">{formatShortDate(sub.nextBillingDate)}</Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-on-surface font-bold">{formatCurrency(sub.cost)}</Text>
                  <Text className="text-[10px] font-bold uppercase text-secondary">Berlangganan</Text>
                </View>
              </View>
            ))}
            
            {nearestSubscriptions.length === 0 && (
               <Text className="text-center text-on-surface-variant py-4 font-medium">Belum ada aktivitas terdekat.</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
    // </SafeAreaView>
  );
}
