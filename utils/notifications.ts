import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('subscriptions', {
      name: 'Pengingat Langganan',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

export async function scheduleSubscriptionReminder(
  subscriptionName: string,
  nextBillingDate: string,
  cost: number
) {
  const billingDate = new Date(nextBillingDate);
  const reminderDate = new Date(billingDate);

  // Set the reminder date to 2 days before the billing date
  reminderDate.setDate(reminderDate.getDate() - 2);

  // Also set the time to morning, for example 09:00 AM
  reminderDate.setHours(9, 0, 0, 0);

  // Testing Notif
  // const reminderDate = new Date();
  // reminderDate.setSeconds(reminderDate.getSeconds() + 10);

  // If the reminder date has already passed, we can't schedule it for the past.
  if (reminderDate <= new Date()) {
    console.log('Reminder date is in the past, skipping notification scheduling.');
    return null;
  }

  const formattedCost = cost.toLocaleString('id-ID');

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pengingat Tagihan Langganan!!!',
      body: `Langganan ${subscriptionName} sebesar Rp ${formattedCost} akan jatuh tempo dalam 2 hari pada ${billingDate.toLocaleDateString('id-ID')}.`,
      data: { subscriptionName, nextBillingDate },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });

  return id;
}
