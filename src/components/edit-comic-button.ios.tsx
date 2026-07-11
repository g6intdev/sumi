import { Button, Host, Icon } from '@expo/ui';
import { accessibilityLabel, buttonBorderShape, buttonStyle } from '@expo/ui/swift-ui/modifiers';

import { useTheme } from '@/theme/theme';

type EditComicButtonProps = {
  onPress: () => void;
};

export function EditComicButton({ onPress }: EditComicButtonProps) {
  const { colors, sizes } = useTheme();

  return (
    <Host matchContents seedColor={colors.accent}>
      <Button
        modifiers={[
          accessibilityLabel('Edit comic'),
          buttonStyle('borderedProminent'),
          buttonBorderShape('circle'),
        ]}
        onPress={onPress}
        style={{
          height: sizes.floatingActionButton,
          width: sizes.floatingActionButton,
        }}>
        <Icon
          color={colors.surface}
          name="square.and.pencil"
          size={sizes.floatingActionIcon}
        />
      </Button>
    </Host>
  );
}
