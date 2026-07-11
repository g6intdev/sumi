import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Button as HeaderButton, Pressable, ScrollView, useWindowDimensions } from 'react-native';

import { ComicPanelCanvas } from '@/components/comic-panel-canvas';
import { saveComic } from '@/storage/comic-library';
import { useTheme } from '@/theme/theme';
import type { SelectedCharacter } from '@/types/character';
import type { Panel } from '@/types/editor';

const panelCount = 4;

export function ComicPreviewScreen() {
  const { characters: serializedCharacters, panels: serializedPanels } = useLocalSearchParams<{
    characters?: string;
    panels?: string;
  }>();
  const { colors, sizes, spacing } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [isSaving, setIsSaving] = useState(false);
  const panels = useMemo<Panel[]>(() => {
    try {
      const parsed = serializedPanels ? JSON.parse(serializedPanels) as Panel[] : [];
      return Array.from({ length: panelCount }, (_, index) => parsed[index] ?? { objects: [] });
    } catch {
      return Array.from({ length: panelCount }, () => ({ objects: [] }));
    }
  }, [serializedPanels]);
  const panelWidth = Math.max(0, windowWidth - spacing.screenHorizontal * 2);
  const panelHeight = panelWidth / sizes.panelAspectRatio;

  function handleSave() {
    if (isSaving) return;
    setIsSaving(true);
    let characters: SelectedCharacter[] = [];
    try {
      characters = serializedCharacters ? JSON.parse(serializedCharacters) as SelectedCharacter[] : [];
    } catch {
      characters = [];
    }
    const createdAt = new Date().toISOString();
    saveComic({ characters, createdAt, id: `${Date.now()}`, panels });
    router.replace('/(tabs)/library');
  }

  return (
    <>
      <ScrollView
      alwaysBounceVertical
      contentInsetAdjustmentBehavior="automatic"
      nestedScrollEnabled
      showsVerticalScrollIndicator
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        alignItems: 'center',
        gap: spacing.contentGap,
        paddingHorizontal: spacing.screenHorizontal,
        paddingBottom: spacing.screenBottom,
      }}>
      {panels.map((panel, index) => (
        <Pressable
          accessibilityHint="Returns to the editor for this panel"
          accessibilityLabel={`Edit panel ${index + 1}`}
          accessibilityRole="button"
          key={index}
          onPress={() => router.dismissTo({
            pathname: '/comic-creator',
            params: {
              activePanel: String(index),
              characters: serializedCharacters,
              panels: serializedPanels,
            },
          })}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
          <ComicPanelCanvas
            height={panelHeight}
            interactive={false}
            onMoveObject={() => {}}
            onSelectObject={() => {}}
            panel={panel}
            width={panelWidth}
          />
        </Pressable>
      ))}
      </ScrollView>
      <Stack.Screen
        options={{
          headerRight: () => <HeaderButton disabled={isSaving} onPress={handleSave} title="Save" />,
        }}
      />
    </>
  );
}
