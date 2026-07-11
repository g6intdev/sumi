import { useState } from 'react';
import { Button, Pressable, Text } from 'react-native';

import { useTheme } from '@/theme/theme';

type HeaderActionButtonProps = {
  onPress: () => void;
  title: string;
};

export function HeaderActionButton({ onPress, title }: HeaderActionButtonProps) {
  const { colors, radii, sizes, spacing, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  if (process.env.EXPO_OS !== 'web') {
    return <Button onPress={onPress} title={title} />;
  }

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole="button"
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: colors.accent,
        borderRadius: radii.control,
        justifyContent: 'center',
        marginRight: spacing.compact,
        opacity: pressed ? 0.8 : 1,
        outlineColor: isFocused ? colors.textPrimary : undefined,
        outlineOffset: isFocused ? spacing.tiny / 2 : undefined,
        outlineWidth: isFocused ? sizes.border : undefined,
        paddingHorizontal: spacing.control,
        paddingVertical: spacing.compact,
      })}>
      <Text style={{ color: colors.textOnAccent, ...typography.label }}>{title}</Text>
    </Pressable>
  );
}
