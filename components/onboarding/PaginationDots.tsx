import { View } from 'react-native';
import { colors } from '../../utils/color';

interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

export default function PaginationDots({ total, activeIndex }: PaginationDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: index === activeIndex ? 28 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor:
              index === activeIndex ? colors.primary.DEFAULT : colors.outline.variant,
          }}
        />
      ))}
    </View>
  );
}
