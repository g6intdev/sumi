import { Button, Host } from '@expo/ui';
import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';

import { useTheme } from '@/theme/theme';

type EditComicButtonProps = {
  onPress: () => void;
};

export function EditComicButton({ onPress }: EditComicButtonProps) {
  const { colors, sizes } = useTheme();
  const iconOffset = (sizes.floatingActionButton - sizes.floatingActionIcon) / 2;

  return (
    <View
      accessible
      accessibilityLabel="Edit comic"
      accessibilityRole="button"
      style={{
        height: sizes.floatingActionButton,
        position: 'relative',
        width: sizes.floatingActionButton,
      }}>
      <Host matchContents seedColor={colors.accent}>
        <Button
          label=""
          onPress={onPress}
          style={{
            backgroundColor: colors.accent,
            borderRadius: sizes.floatingActionButton / 2,
            height: sizes.floatingActionButton,
            width: sizes.floatingActionButton,
          }}
        />
      </Host>
      <SymbolView
        name={{ ios: 'square.and.pencil', android: 'edit', web: 'edit' }}
        size={sizes.floatingActionIcon}
        pointerEvents="none"
        style={{
          left: iconOffset,
          position: 'absolute',
          top: iconOffset,
        }}
        tintColor={colors.surface}
      />
    </View>
  );
}
