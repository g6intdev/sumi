import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, useColorScheme } from 'react-native';

import { useTheme } from '@/theme/theme';
import type { SelectedCharacter } from '@/types/character';

export function ComicCreatorScreen() {
  useColorScheme();
  const { characters: serializedCharacters } = useLocalSearchParams<{ characters?: string }>();
  const { colors, radii, sizes, spacing, typography } = useTheme();

  let characters: SelectedCharacter[] = [];
  try {
    characters = serializedCharacters ? JSON.parse(serializedCharacters) : [];
  } catch {
    characters = [];
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: spacing.screenHorizontal,
        paddingBottom: spacing.screenBottom,
        gap: spacing.contentGap,
      }}>
      <Text selectable style={{ color: colors.textSecondary, ...typography.body }}>
        Your selected cast is ready for this comic.
      </Text>
      {characters.map((character) => (
        <View
          key={character.id}
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderCurve: 'continuous',
            borderRadius: radii.surface,
            borderWidth: sizes.border,
            gap: spacing.compact,
            padding: spacing.section,
          }}>
          <Text selectable style={{ color: colors.textPrimary, ...typography.label }}>
            {character.id}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}
