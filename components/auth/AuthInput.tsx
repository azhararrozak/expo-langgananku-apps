import { View, TextInput, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../utils/color';

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

interface AuthInputProps extends TextInputProps {
  icon: MaterialIconName;
}

export default function AuthInput({ icon, ...props }: AuthInputProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-1">
      <MaterialIcons name={icon} size={22} color={colors.outline.DEFAULT} />
      <TextInput
        className="flex-1 font-body text-base text-on-background"
        placeholderTextColor={colors.outline.DEFAULT}
        {...props}
      />
    </View>
  );
}
