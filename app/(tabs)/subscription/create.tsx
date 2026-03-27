import { View, Text, ScrollView, TextInput, Image, Pressable, Switch, Platform } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../utils/color';

const categories = ['Streaming', 'Music', 'Gym', 'Cloud', 'Productivity'];

const CreateSubscriptionScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('Streaming');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [billingDate, setBillingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [price, setPrice] = useState('');

  const formatPrice = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="mb-10 px-4 pt-4">
        {/* Search Bar */}
        <View className="relative">
          <View className="absolute left-4 top-0 bottom-0 z-10 justify-center">
            <MaterialIcons name="search" size={22} color={colors.outline.DEFAULT} />
          </View>
          <TextInput
            className="h-14 w-full rounded-2xl bg-surface-container-highest pl-12 pr-4 font-medium"
            placeholder="Cari layanan populer..."
            placeholderTextColor={colors.outline.DEFAULT}
          />
        </View>

        {/* Popular Suggestions */}
        <View className="mt-6">
          <Text className="mb-4 font-headline text-sm font-bold uppercase tracking-wide text-on-surface-variant">
            Populer
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {/* Disney+ */}
            <Pressable className="flex-row items-center gap-3 rounded-xl bg-surface-container-lowest p-2 pr-4 shadow-sm active:opacity-70">
              <View className="h-10 w-10 overflow-hidden rounded-lg bg-indigo-900">
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDsxjgV0ZoDL4PtIK_t69ZE2TRBjIpo5UdirZvk84xVADPVYqvsQ4nfQC7MAooUfH0FnpgPTVtqwru9B7NRbKweYH9nBBMHhdwQCawYDKKfjM_cBjy2mCvSc_W7ophFPY4x24rdikwVoPTVIG_ADqAFQ6MZ3DKGw0poAFKJ5VafdJgvUEAa_xnb-GwhaVa8eeiW8E2NT9EaxSYBryLMawyLWha2mOYrSf9wh1M1DOhBEkjx4igPCoJ_zoTw7Ifpg07FnBGFZsQ2dg',
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-sm font-semibold">Disney+</Text>
            </Pressable>

            {/* HBO Max */}
            <Pressable className="flex-row items-center gap-3 rounded-xl bg-surface-container-lowest p-2 pr-4 shadow-sm active:opacity-70">
              <View className="h-10 w-10 overflow-hidden rounded-lg bg-black">
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGhOR4pe7fG57lQFsSVGTejyFnGV-Ufo41_JxGBFM7_WIOysm9QZ_lr8efkXzv7-7ERUKs_d1XJLx9k0CDvOfRSP4qDHg5Fzkwtf7VxT3RQH3PVfx3K4qgZV66m7QWdvk9A44W4TX2MrULOOSbcvCdqzs1PNx8C9JTDlSmHee2_tJaDktuUeYDoEUpwdHbHRsKtQRWxo6Zy3j4qjHcBSQSqsOEDj7OKatmSOvvRZEPSvHMPHTioUKKtrjJBwvL_-GE8NDfOeGavPY',
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-sm font-semibold">HBO Max</Text>
            </Pressable>

            {/* YouTube Premium */}
            <Pressable className="flex-row items-center gap-3 rounded-xl bg-surface-container-lowest p-2 pr-4 shadow-sm active:opacity-70">
              <View className="h-10 w-10 overflow-hidden rounded-lg bg-red-600">
                <Image
                  source={{
                    uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4ikv3zC7Kku_gGbGcl7LrZWgiCzyGAsTc2DoeifN0oz7hZzujtTaVMG2N2rMYz0lGbIFWzHfjirb2dyuVkH51ag4HscmdU3NWBuG--PGqnkBZB6rStjO7jbGBsKKe5Ji3nY1G_8YhmWfFOhAagA1LoXJabuwxAX2srE1jwikmGjq2our53NtCMsMQUKSnaCYZ2efcb0APMAzzISxlhPRFrtzbK8xvwLgULiemOMprIju0Cku71PUwDAu8XOxhP86h6vv4eJFLjtI',
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-sm font-semibold">YouTube Premium</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Form */}
      <View className="mx-4 mb-10 gap-8 rounded-[2rem] bg-surface-container-low p-8">
        {/* Nama Layanan */}
        <View>
          <Text className="mb-2 ml-1 font-headline text-sm font-bold text-on-surface-variant">
            Nama Layanan
          </Text>
          <View className="relative">
            <TextInput
              className="h-16 w-full rounded-xl bg-surface-container-lowest px-5 text-lg font-semibold"
              placeholder="Contoh: Spotify, Netflix"
              placeholderTextColor={colors.outline.DEFAULT}
              defaultValue="Netflix"
            />
            <View className="absolute right-4 top-4 h-8 w-8 overflow-hidden rounded-md bg-slate-900">
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbkYI-vv-79KZxzGofEZb4bjKAS4mzNp9A6s7nlFTKjIGs0Lo0iR-fPWltzPQoegyFvKJgD-RrUJPUI3_f7sSE6NmKZ5vbPgLP_EJrOALGG8YgDYZFHBEy8Xezbompxb3sPHpoduzciTR7HtKySuf5fYkhhhJWSB_0TQhcdUYhR81f5gbKiTxm1EdQK3TEfvHdoKzb3d7sQ9kmSqAx5sSlXmg3sESKZL-8YWzTOipZXxk6iIaYMdzdvpgQ_PKEWRpSxGe56_vJjs4',
                }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Kategori */}
        <View>
          <Text className="mb-3 ml-1 font-headline text-sm font-bold text-on-surface-variant">
            Kategori
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2.5 ${
                  selectedCategory === cat
                    ? 'bg-primary'
                    : 'bg-surface-container-highest'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    selectedCategory === cat ? 'text-white' : 'text-on-surface-variant'
                  }`}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Harga & Tanggal */}
        <View className="flex-row gap-4">
          {/* Harga Bulanan */}
          <View className="flex-1">
            <Text className="mb-2 ml-1 font-headline text-sm font-bold text-on-surface-variant">
              Harga Bulanan
            </Text>
            <View className="relative">
              <Text className="absolute left-5 top-5 z-10 font-bold text-on-surface-variant">
                Rp
              </Text>
              <TextInput
                className="h-16 w-full rounded-xl bg-surface-container-lowest pl-12 pr-5 text-lg font-semibold"
                placeholder="0"
                placeholderTextColor={colors.outline.DEFAULT}
                keyboardType="numeric"
                value={price}
                onChangeText={(text) => setPrice(formatPrice(text))}
              />
            </View>
          </View>

          {/* Tanggal Tagihan */}
          <View className="flex-1">
            <Text className="mb-2 ml-1 font-headline text-sm font-bold text-on-surface-variant">
              Tanggal Tagihan
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="relative h-16 justify-center rounded-xl bg-surface-container-lowest px-5"
            >
              <Text className="text-lg font-semibold">
                {billingDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
              <View className="absolute right-4 top-5">
                <MaterialIcons name="calendar-today" size={20} color={colors.outline.DEFAULT} />
              </View>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={billingDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) setBillingDate(selectedDate);
                }}
              />
            )}
          </View>
        </View>

        {/* Reminder Toggle */}
        <View className="flex-row items-center justify-between border-t border-outline-variant/20 pt-4">
          <View>
            <Text className="font-headline font-bold">Ingatkan Saya</Text>
            <Text className="text-sm text-on-surface-variant">
              Kirim notifikasi 2 hari sebelumnya
            </Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: colors.outline.variant, true: colors.secondary.DEFAULT }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Buttons */}
      <View className="mt-4 px-4 pb-10">
        <Pressable className="overflow-hidden rounded-2xl shadow-xl active:opacity-90">
          <LinearGradient
            colors={[colors.primary.DEFAULT, colors.primary.container]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="h-16 flex-row items-center justify-center gap-2"
          >
            <Text className="font-headline text-lg font-bold text-white">Simpan Langganan</Text>
            <MaterialIcons name="check-circle" size={22} color="white" />
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="mt-4 h-14 items-center justify-center active:opacity-60"
        >
          <Text className="font-medium text-on-surface-variant">Batalkan</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CreateSubscriptionScreen;