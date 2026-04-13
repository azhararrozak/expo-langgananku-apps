import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../utils/color';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
}

export default function AuthButton({ title, onPress, variant = 'primary' }: AuthButtonProps) {
  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        className="w-full items-center rounded-2xl border-2 border-primary py-4"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <Text className="font-headline text-base font-bold text-primary">{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className="w-full overflow-hidden rounded-2xl"
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <LinearGradient
        colors={[colors.primary.DEFAULT, colors.primary.container]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="items-center py-4"
      >
        <Text className="font-headline text-base font-bold text-on-primary">{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}
