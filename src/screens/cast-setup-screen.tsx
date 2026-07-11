import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, useColorScheme } from 'react-native';

import { useTheme } from '@/theme/theme';
import type { SelectedCharacter } from '@/types/character';

const characters = [
  { id: 'character-a', label: 'Character A', monogram: 'A' },
  { id: 'character-b', label: 'Character B', monogram: 'B' },
  { id: 'character-c', label: 'Character C', monogram: 'C' },
  { id: 'character-d', label: 'Character D', monogram: 'D' },
] as const;

export function CastSetupScreen() {
  useColorScheme();
  const { colors, radii, sizes, spacing, typography } = useTheme();
  const [selected, setSelected] = useState<SelectedCharacter[]>([]);
  const [draftComic] = useState(() => ({
    createdAt: new Date().toISOString(),
    id: `${Date.now()}`,
  }));

  const selectedIds = useMemo(() => new Set(selected.map((character) => character.id)), [selected]);

  function toggleCharacter(id: string) {
    setSelected((current) => {
      if (current.some((character) => character.id === id)) {
        return current.filter((character) => character.id !== id);
      }
      return [...current, { id }];
    });
  }

  function continueToCreator() {
    router.push({
      pathname: '/comic-creator',
      params: {
        characters: JSON.stringify(selected),
        comicId: draftComic.id,
        createdAt: draftComic.createdAt,
      },
    });
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingHorizontal: spacing.screenHorizontal,
        paddingTop: spacing.section,
        paddingBottom: spacing.screenBottom,
        gap: spacing.contentGap,
      }}>
      <View style={{ gap: spacing.compact }}>
        <Text selectable style={{ color: colors.textSecondary, ...typography.body }}>
          Pick the appearances you want to use in your comic.
        </Text>
        <Text selectable style={{ color: colors.textSecondary, ...typography.caption }}>
          {selected.length} selected
        </Text>
      </View>

      <View style={{ gap: spacing.control }}>
        {characters.map((character) => {
          const isSelected = selectedIds.has(character.id);

          return (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSelected }}
              key={character.id}
              onPress={() => toggleCharacter(character.id)}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: isSelected ? colors.accentSoft : colors.surface,
                borderColor: isSelected ? colors.accent : colors.border,
                borderCurve: 'continuous',
                borderRadius: radii.surface,
                borderWidth: isSelected ? sizes.selectedBorder : sizes.border,
                flexDirection: 'row',
                gap: spacing.section,
                opacity: pressed ? 0.75 : 1,
                padding: spacing.section,
              })}>
              <View
                accessibilityElementsHidden
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.avatar,
                  borderCurve: 'continuous',
                  borderRadius: radii.avatar,
                  height: sizes.avatar,
                  justifyContent: 'center',
                  width: sizes.avatar,
                }}>
                <Text style={{ color: colors.accent, ...typography.body, fontWeight: '700' }}>
                  {character.monogram}
                </Text>
              </View>
              <Text style={{ color: colors.textPrimary, ...typography.label, flex: 1 }}>
                {character.label}
              </Text>
              <Text style={{ color: isSelected ? colors.accent : colors.textSecondary, ...typography.label }}>
                {isSelected ? 'Selected' : 'Select'}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: selected.length === 0 }}
        disabled={selected.length === 0}
        onPress={continueToCreator}
        style={({ pressed }) => ({
          alignItems: 'center',
          backgroundColor: colors.accent,
          borderCurve: 'continuous',
          borderRadius: radii.control,
          height: sizes.buttonHeight,
          justifyContent: 'center',
          opacity: selected.length === 0 ? 0.35 : pressed ? 0.75 : 1,
        })}>
        <Text style={{ color: colors.surface, ...typography.label }}>Continue</Text>
      </Pressable>

    </ScrollView>
  );
}
