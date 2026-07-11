import { SymbolView } from 'expo-symbols';
import { Pressable } from 'react-native';

import { useTheme } from '@/theme/theme';

type EditComicButtonProps = {
  onPress: () => void;
};

export function EditComicButton({ onPress }: EditComicButtonProps) {
  const { colors, sizes } = useTheme();

  return (
    <Pressable
      accessibilityLabel="Edit comic"
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center',
        backgroundColor: colors.accent,
        borderRadius: sizes.floatingActionButton / 2,
        height: sizes.floatingActionButton,
        justifyContent: 'center',
        opacity: pressed ? 0.7 : 1,
        width: sizes.floatingActionButton,
      })}>
      <SymbolView
        name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
        size={sizes.floatingActionIcon}
        tintColor={colors.surface}
      />
    </Pressable>
  );
}
