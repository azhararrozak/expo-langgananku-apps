import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface CardProps {
  title: string;
  description?: string;
  iconName?: IoniconsName;
  iconColor?: string;
  iconSize?: number;
  onPress?: () => void;
}

export default function Card({
  title,
  description,
  iconName = 'document-text-outline',
  iconColor = '#4355b9',
  iconSize = 28,
  onPress,
}: CardProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-xl bg-surface-container-low p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Icon Container */}
      <View className="items-center justify-center rounded-lg bg-primary-fixed p-3">
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </View>

      {/* Text Content */}
      <View className="flex-1">
        <Text className="font-headline text-base font-semibold text-on-background">
          {title}
        </Text>
        {description && (
          <Text className="mt-1 font-body text-sm text-on-surface-variant">
            {description}
          </Text>
        )}
      </View>

      {/* Chevron jika bisa ditekan */}
      {onPress && (
        <Ionicons name="chevron-forward" size={20} color="#757684" />
      )}
    </Wrapper>
  );
}
