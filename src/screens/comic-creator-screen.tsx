import { BottomSheet, Button, Column, Host, Row, Spacer, Text as NativeText, TextInput as NativeTextInput } from '@expo/ui';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';

import { ComicPanelCanvas } from '@/components/comic-panel-canvas';
import { HeaderActionButton } from '@/components/header-action-button';
import { getComic, saveComic } from '@/storage/comic-library';
import { getComicBackgroundColor, useTheme } from '@/theme/theme';
import type { SelectedCharacter } from '@/types/character';
import { normalizePanels, type CanvasObject, type Panel } from '@/types/editor';

type PickerKind = 'scene' | 'character' | 'asset' | 'expression' | 'dialogue';

const choices = {
  scene: [{ id: 'paper', label: 'Paper' }, { id: 'sky', label: 'Blue sky' }, { id: 'sunset', label: 'Sunset' }],
  asset: [{ id: 'table', label: 'Table' }, { id: 'phone', label: 'Phone' }, { id: 'cup', label: 'Cup' }],
  expression: [{ id: 'happy', label: 'Happy 😄' }, { id: 'surprised', label: 'Surprised 😮' }, { id: 'annoyed', label: 'Annoyed 😒' }],
} as const;

const panelCount = 4;

export function ComicCreatorScreen() {
  const {
    activePanel: initialActivePanel,
    characters: serializedCharacters,
    comicId: initialComicId,
    createdAt: initialCreatedAt,
    panels: serializedPanels,
  } = useLocalSearchParams<{ activePanel?: string; characters?: string; comicId?: string; createdAt?: string; panels?: string }>();
  const { colors, radii, sizes, spacing, typography } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const savedComic = initialComicId ? getComic(initialComicId) : undefined;
  const [editorHeight, setEditorHeight] = useState(windowHeight);
  const [panels, setPanels] = useState<Panel[]>(() => {
    try {
      const parsed = serializedPanels
        ? normalizePanels(JSON.parse(serializedPanels))
        : normalizePanels(savedComic?.panels);
      return Array.from({ length: panelCount }, (_, index) => parsed[index] ?? { objects: [] });
    } catch {
      return Array.from({ length: panelCount }, () => ({ objects: [] }));
    }
  });
  const [activePanelIndex, setActivePanelIndex] = useState(() => {
    const index = Number(initialActivePanel);
    return Number.isInteger(index) && index >= 0 && index < panelCount ? index : 0;
  });
  const [selectedObjectId, setSelectedObjectId] = useState<string>();
  const [picker, setPicker] = useState<PickerKind>();
  const [dialogueDraft, setDialogueDraft] = useState('');
  const [nextObjectId, setNextObjectId] = useState(1);
  const [comicId] = useState(() => initialComicId ?? `${Date.now()}`);
  const [createdAt] = useState(() => initialCreatedAt ?? savedComic?.createdAt ?? new Date().toISOString());
  const [name] = useState(() => savedComic?.name ?? 'Untitled Comic');
  const backgroundColor = savedComic?.backgroundColor ?? getComicBackgroundColor(comicId);

  const characters = useMemo(() => {
    try {
      return serializedCharacters ? (JSON.parse(serializedCharacters) as SelectedCharacter[]) : [];
    } catch {
      return [];
    }
  }, [serializedCharacters]);

  useEffect(() => {
    saveComic({
      backgroundColor,
      characters,
      createdAt,
      id: comicId,
      name,
      panels,
    });
  }, [backgroundColor, characters, comicId, createdAt, name, panels]);

  useEffect(() => {
    const index = Number(initialActivePanel);
    if (Number.isInteger(index) && index >= 0 && index < panelCount) {
      goToPanel(index);
    }
  }, [initialActivePanel]);

  const panel = panels[activePanelIndex];
  const selectedObject = panel.objects.find((object) => object.id === selectedObjectId);
  const availableCanvasWidth = Math.max(0, windowWidth - spacing.screenHorizontal * 2);
  const availableCanvasHeight = Math.max(0, editorHeight - sizes.panelEditorChromeHeight);
  const canvasWidth = process.env.EXPO_OS === 'web'
    ? Math.min(availableCanvasWidth, availableCanvasHeight * sizes.panelAspectRatio)
    : availableCanvasWidth;
  const canvasHeight = canvasWidth / sizes.panelAspectRatio;
  const bottomSheetButtonWidth = Math.max(0, windowWidth - spacing.screenHorizontal * 4);

  function updateObject(id: string, update: Partial<CanvasObject>) {
    updatePanel((current) => ({ ...current, objects: current.objects.map((object) => object.id === id ? { ...object, ...update } : object) }));
  }

  function updatePanel(update: (panel: Panel) => Panel) {
    setPanels((current) => current.map((item, index) => index === activePanelIndex ? update(item) : item));
  }

  function goToPanel(index: number) {
    setActivePanelIndex(index);
    setSelectedObjectId(undefined);
    setPicker(undefined);
  }

  function addObject(type: CanvasObject['type'], assetId: string) {
    const objectSize = type === 'character' ? sizes.canvasObject : sizes.assetObject;
    const id = `${type}-${nextObjectId}`;
    setNextObjectId((current) => current + 1);
    const width = canvasWidth > 0 ? objectSize / canvasWidth : 0;
    const height = canvasHeight > 0 ? objectSize / canvasHeight : 0;
    const object: CanvasObject = {
      id,
      type,
      assetId,
      width,
      height,
      x: (1 - width) / 2,
      y: (1 - height) / 2,
    };
    updatePanel((current) => ({ ...current, objects: [...current.objects, object] }));
    setSelectedObjectId(id);
    setPicker(undefined);
  }

  function deleteSelected() {
    updatePanel((current) => ({ ...current, objects: current.objects.filter((object) => object.id !== selectedObjectId) }));
    setSelectedObjectId(undefined);
  }

  const action = (label: string, onPress: () => void, danger = false) => (
    <Host key={label} matchContents seedColor={danger ? colors.danger : colors.accent}>
      <Button label={label} onPress={onPress} variant="outlined" />
    </Host>
  );

  const bottomSheetButton = (label: string, onPress: () => void, variant: 'filled' | 'outlined' | 'text' = 'outlined') => (
    <Button key={label} onPress={onPress} variant={variant}>
      <Row style={{ width: bottomSheetButtonWidth }}>
        <Spacer />
        <NativeText>{label}</NativeText>
        <Spacer />
      </Row>
    </Button>
  );

  const pickerTitle = picker === 'scene' ? 'Choose a scene' : picker === 'character' ? 'Add a character' : picker === 'asset' ? 'Add an asset' : picker === 'expression' ? 'Choose an expression' : 'Add dialogue';
  function chooseNativeItem(kind: 'scene' | 'character' | 'asset', id: string) {
    if (kind === 'scene') {
      updatePanel((current) => ({ ...current, sceneId: id }));
      setPicker(undefined);
    } else {
      addObject(kind, id);
    }
  }

  return (
    <>
      <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      onLayout={(event) => setEditorHeight(event.nativeEvent.layout.height)}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ alignItems: 'center', gap: spacing.contentGap, paddingHorizontal: spacing.screenHorizontal, paddingBottom: spacing.screenBottom }}>
      <Host matchContents>
        <NativeText textStyle={{ color: colors.textPrimary, ...typography.title }}>{`Panel ${activePanelIndex + 1} of ${panelCount}`}</NativeText>
      </Host>
      <ComicPanelCanvas height={canvasHeight} onMoveObject={(id, x, y) => updateObject(id, { x, y })} onSelectObject={setSelectedObjectId} panel={panel} selectedObjectId={selectedObjectId} width={canvasWidth} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.control, justifyContent: 'center' }}>
        {selectedObject?.type === 'character' ? (
          <>{action('Dialogue', () => { setDialogueDraft(selectedObject.dialogue ?? ''); setPicker('dialogue'); })}{action('Expression', () => setPicker('expression'))}{action('Delete', deleteSelected, true)}</>
        ) : (
          <>{action('Scene', () => setPicker('scene'))}{action('Character', () => setPicker('character'))}{action('Asset', () => setPicker('asset'))}</>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: spacing.compact, justifyContent: 'center', width: '100%' }}>
        <Host matchContents seedColor={colors.accent}>
          <Button disabled={activePanelIndex === 0} onPress={() => goToPanel(activePanelIndex - 1)} variant="outlined">
            <NativeText textStyle={{ color: colors.textPrimary, ...typography.label }}>‹</NativeText>
          </Button>
        </Host>
        {panels.map((_, index) => (
          <Host key={index} matchContents seedColor={colors.accent}>
            <Button
              label={`${index + 1}`}
              onPress={() => goToPanel(index)}
              variant={index === activePanelIndex ? 'filled' : 'outlined'}
            />
          </Host>
        ))}
        <Host matchContents seedColor={colors.accent}>
          <Button disabled={activePanelIndex === panelCount - 1} onPress={() => goToPanel(activePanelIndex + 1)} variant="outlined">
            <NativeText textStyle={{ color: colors.textPrimary, ...typography.label }}>›</NativeText>
          </Button>
        </Host>
      </View>

      <Host matchContents seedColor={colors.accent}>
        <BottomSheet
          isPresented={picker !== undefined}
          onDismiss={() => setPicker(undefined)}
          showDragIndicator>
          <Column alignment="start" spacing={spacing.control} style={{ padding: spacing.screenHorizontal }}>
            <NativeText textStyle={{ color: colors.textPrimary, ...typography.body, fontWeight: '700' }}>
              {pickerTitle}
            </NativeText>
            {picker === 'character' ? characters.map((character) => (
              bottomSheetButton(character.id, () => chooseNativeItem('character', character.id))
            )) : null}
            {picker === 'character' && characters.length === 0 ? (
              <NativeText textStyle={{ color: colors.textSecondary, ...typography.body }}>
                No cast members were selected.
              </NativeText>
            ) : null}
            {picker === 'scene' ? choices.scene.map((choice) => (
              bottomSheetButton(choice.label, () => chooseNativeItem('scene', choice.id))
            )) : null}
            {picker === 'asset' ? choices.asset.map((choice) => (
              bottomSheetButton(choice.label, () => chooseNativeItem('asset', choice.id))
            )) : null}
            {picker === 'expression' ? choices.expression.map((choice) => (
              bottomSheetButton(choice.label, () => {
                  if (selectedObjectId) updateObject(selectedObjectId, { expressionId: choice.id });
                  setPicker(undefined);
                })
            )) : null}
            {picker === 'dialogue' ? (
              <>
                <NativeTextInput
                  autoFocus
                  defaultValue={dialogueDraft}
                  multiline
                  numberOfLines={4}
                  onChangeText={setDialogueDraft}
                  placeholder="What do they say?"
                  placeholderTextColor={colors.textSecondary}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderRadius: radii.control,
                    borderWidth: sizes.border,
                    height: sizes.buttonHeight * 2,
                    padding: spacing.section,
                  }}
                  textStyle={{ color: colors.textPrimary, ...typography.body }}
                />
                {bottomSheetButton('Save dialogue', () => {
                    if (selectedObjectId) updateObject(selectedObjectId, { dialogue: dialogueDraft.trim() || undefined });
                    setPicker(undefined);
                  }, 'filled')}
              </>
            ) : null}
            {bottomSheetButton('Cancel', () => setPicker(undefined), 'text')}
          </Column>
        </BottomSheet>
      </Host>
      </ScrollView>
      <Stack.Screen
        options={{
          headerRight: () => (
            <HeaderActionButton
              onPress={() => router.push({
                pathname: '/comic-preview',
                params: {
                  backgroundColor,
                  characters: serializedCharacters,
                  comicId,
                  createdAt,
                  panels: JSON.stringify(panels),
                },
              })}
              title="Next"
            />
          ),
        }}
      />
    </>
  );
}
