import { Host, Picker, Row, Text as NativeText } from '@expo/ui';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Button as HeaderButton, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ComicPanelCanvas } from '@/components/comic-panel-canvas';
import { EditComicButton } from '@/components/edit-comic-button';
import { getComic, saveComic } from '@/storage/comic-library';
import { comicBackgroundOptions, getComicBackgroundColor, useTheme } from '@/theme/theme';
import type { SelectedCharacter } from '@/types/character';
import { normalizePanels, type Panel } from '@/types/editor';

const panelCount = 4;

export function ComicPreviewScreen() {
  const { backgroundColor, characters: serializedCharacters, comicId, createdAt, panels: serializedPanels } = useLocalSearchParams<{
    backgroundColor?: string;
    characters?: string;
    comicId?: string;
    createdAt?: string;
    panels?: string;
  }>();
  const { colors, sizes, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const savedComic = comicId ? getComic(comicId) : undefined;
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(
    () => backgroundColor ?? savedComic?.backgroundColor ?? getComicBackgroundColor(comicId ?? ''),
  );
  const panels = useMemo<Panel[]>(() => {
    try {
      const parsed = serializedPanels ? normalizePanels(JSON.parse(serializedPanels)) : [];
      return Array.from({ length: panelCount }, (_, index) => parsed[index] ?? { objects: [] });
    } catch {
      return Array.from({ length: panelCount }, () => ({ objects: [] }));
    }
  }, [serializedPanels]);
  const panelWidth = Math.max(
    0,
    Math.min(windowWidth - spacing.screenHorizontal * 2, sizes.modalMaxWidth),
  );
  const panelHeight = panelWidth / sizes.panelAspectRatio;

  function changeBackgroundColor(color: string) {
    setCurrentBackgroundColor(color);
    if (!comicId) return;

    const comic = getComic(comicId) ?? savedComic;
    if (comic) {
      saveComic({ ...comic, backgroundColor: color });
      return;
    }

    try {
      saveComic({
        backgroundColor: color,
        characters: serializedCharacters ? JSON.parse(serializedCharacters) as SelectedCharacter[] : [],
        createdAt: createdAt ?? new Date().toISOString(),
        id: comicId,
        name: 'Untitled Comic',
        panels,
      });
    } catch {
      // Keep the preview updated if the route's character data is malformed.
    }
  }

  function editComic(activePanel = 0) {
    router.dismissTo({
      pathname: '/comic-creator',
      params: {
        activePanel: String(activePanel),
        backgroundColor: currentBackgroundColor,
        characters: serializedCharacters,
        comicId,
        createdAt,
        panels: serializedPanels,
      },
    });
  }

  return (
    <>
      <ScrollView
      alwaysBounceVertical
      contentInsetAdjustmentBehavior="automatic"
      nestedScrollEnabled
      showsVerticalScrollIndicator
      style={{ flex: 1, backgroundColor: currentBackgroundColor }}
      contentContainerStyle={{
        alignItems: 'center',
        gap: spacing.contentGap,
        paddingHorizontal: spacing.screenHorizontal,
        paddingBottom: spacing.screenBottom,
      }}>
      <Host matchContents seedColor={colors.accent}>
        <Row alignment="center" spacing={spacing.compact}>
          <NativeText>Background:</NativeText>
          <Picker selectedValue={currentBackgroundColor} onValueChange={changeBackgroundColor}>
            {comicBackgroundOptions.map(({ color, label }) => (
              <Picker.Item key={color} label={label} value={color} />
            ))}
          </Picker>
        </Row>
      </Host>
      {panels.map((panel, index) => (
        <Pressable
          accessibilityHint="Returns to the editor for this panel"
          accessibilityLabel={`Edit panel ${index + 1}`}
          accessibilityRole="button"
          key={index}
          onPress={() => editComic(index)}
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
      <View
        style={{
          bottom: insets.bottom + spacing.screenBottom,
          position: 'absolute',
          right: spacing.screenHorizontal,
          alignItems: 'flex-end',
        }}>
        <EditComicButton onPress={() => editComic()} />
      </View>
      <Stack.Screen
        options={{
          headerRight: () => <HeaderButton onPress={() => router.replace('/(tabs)/library')} title="Done" />,
        }}
      />
    </>
  );
}
