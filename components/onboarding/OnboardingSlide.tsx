import { View, Text, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/color';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

export interface OnboardingSlideData {
  id: string;
  icon: MaterialIconName;
  title: string;
  description: string;
  gradientColors: [string, string];
}

interface OnboardingSlideProps {
  data: OnboardingSlideData;
}

export default function OnboardingSlide({ data }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      {/* Icon Container */}
      <View className="mb-10 overflow-hidden rounded-[40px]">
        <LinearGradient
          colors={data.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="items-center justify-center p-10"
        >
          <MaterialIcons name={data.icon} size={72} color={colors['on-primary'].DEFAULT} />
        </LinearGradient>
      </View>

      {/* Title */}
      <Text className="mb-4 text-center font-headline text-3xl font-extrabold tracking-tight text-on-background">
        {data.title}
      </Text>

      {/* Description */}
      <Text className="text-center font-body text-base leading-6 text-on-surface-variant">
        {data.description}
      </Text>
    </View>
  );
}
