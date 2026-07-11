import { BottomSheet, Button, Column, Host, Text as NativeText, TextInput as NativeTextInput } from '@expo/ui';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';

import { ComicPanelCanvas } from '@/components/comic-panel-canvas';
import { useTheme } from '@/theme/theme';
import type { SelectedCharacter } from '@/types/character';
import type { CanvasObject, Panel } from '@/types/editor';

type PickerKind = 'background' | 'character' | 'asset' | 'expression' | 'dialogue';

const choices = {
  background: [{ id: 'paper', label: 'Paper' }, { id: 'sky', label: 'Blue sky' }, { id: 'sunset', label: 'Sunset' }],
  asset: [{ id: 'table', label: 'Table' }, { id: 'phone', label: 'Phone' }, { id: 'cup', label: 'Cup' }],
  expression: [{ id: 'happy', label: 'Happy 😄' }, { id: 'surprised', label: 'Surprised 😮' }, { id: 'annoyed', label: 'Annoyed 😒' }],
} as const;

export function ComicCreatorScreen() {
  const { characters: serializedCharacters } = useLocalSearchParams<{ characters?: string }>();
  const { colors, radii, sizes, spacing, typography } = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [editorHeight, setEditorHeight] = useState(windowHeight);
  const [panel, setPanel] = useState<Panel>({ objects: [] });
  const [selectedObjectId, setSelectedObjectId] = useState<string>();
  const [picker, setPicker] = useState<PickerKind>();
  const [dialogueDraft, setDialogueDraft] = useState('');
  const [nextObjectId, setNextObjectId] = useState(1);

  const characters = useMemo(() => {
    try {
      return serializedCharacters ? (JSON.parse(serializedCharacters) as SelectedCharacter[]) : [];
    } catch {
      return [];
    }
  }, [serializedCharacters]);
  const selectedObject = panel.objects.find((object) => object.id === selectedObjectId);
  const availableCanvasWidth = Math.max(0, windowWidth - spacing.screenHorizontal * 2);
  const availableCanvasHeight = Math.max(0, editorHeight - sizes.panelEditorChromeHeight);
  const canvasWidth = process.env.EXPO_OS === 'web'
    ? Math.min(availableCanvasWidth, availableCanvasHeight * sizes.panelAspectRatio)
    : availableCanvasWidth;
  const canvasHeight = canvasWidth / sizes.panelAspectRatio;

  function updateObject(id: string, update: Partial<CanvasObject>) {
    setPanel((current) => ({ ...current, objects: current.objects.map((object) => object.id === id ? { ...object, ...update } : object) }));
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
    setPanel((current) => ({ ...current, objects: [...current.objects, object] }));
    setSelectedObjectId(id);
    setPicker(undefined);
  }

  function deleteSelected() {
    setPanel((current) => ({ ...current, objects: current.objects.filter((object) => object.id !== selectedObjectId) }));
    setSelectedObjectId(undefined);
  }

  const action = (label: string, onPress: () => void, danger = false) => (
    <Host key={label} matchContents seedColor={danger ? colors.danger : colors.accent}>
      <Button label={label} onPress={onPress} variant="outlined" />
    </Host>
  );

  const pickerTitle = picker === 'background' ? 'Choose a background' : picker === 'character' ? 'Add a character' : picker === 'asset' ? 'Add an asset' : picker === 'expression' ? 'Choose an expression' : 'Add dialogue';
  function chooseNativeItem(kind: 'background' | 'character' | 'asset', id: string) {
    if (kind === 'background') {
      setPanel((current) => ({ ...current, backgroundId: id }));
      setPicker(undefined);
    } else {
      addObject(kind, id);
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      onLayout={(event) => setEditorHeight(event.nativeEvent.layout.height)}
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ alignItems: 'center', gap: spacing.contentGap, paddingHorizontal: spacing.screenHorizontal, paddingBottom: spacing.screenBottom }}>
      <Host matchContents>
        <NativeText textStyle={{ color: colors.textPrimary, ...typography.title }}>Panel 1 of 4</NativeText>
      </Host>
      <ComicPanelCanvas height={canvasHeight} onMoveObject={(id, x, y) => updateObject(id, { x, y })} onSelectObject={setSelectedObjectId} panel={panel} selectedObjectId={selectedObjectId} width={canvasWidth} />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.control, justifyContent: 'center' }}>
        {selectedObject?.type === 'character' ? (
          <>{action('Dialogue', () => { setDialogueDraft(selectedObject.dialogue ?? ''); setPicker('dialogue'); })}{action('Expression', () => setPicker('expression'))}{action('Delete', deleteSelected, true)}</>
        ) : (
          <>{action('Background', () => setPicker('background'))}{action('Character', () => setPicker('character'))}{action('Asset', () => setPicker('asset'))}</>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        {action('Previous', () => {})}{action('Next', () => {})}
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
              <Button key={character.id} label={character.id} onPress={() => chooseNativeItem('character', character.id)} variant="outlined" />
            )) : null}
            {picker === 'character' && characters.length === 0 ? (
              <NativeText textStyle={{ color: colors.textSecondary, ...typography.body }}>
                No cast members were selected.
              </NativeText>
            ) : null}
            {picker === 'background' ? choices.background.map((choice) => (
              <Button key={choice.id} label={choice.label} onPress={() => chooseNativeItem('background', choice.id)} variant="outlined" />
            )) : null}
            {picker === 'asset' ? choices.asset.map((choice) => (
              <Button key={choice.id} label={choice.label} onPress={() => chooseNativeItem('asset', choice.id)} variant="outlined" />
            )) : null}
            {picker === 'expression' ? choices.expression.map((choice) => (
              <Button
                key={choice.id}
                label={choice.label}
                onPress={() => {
                  if (selectedObjectId) updateObject(selectedObjectId, { expressionId: choice.id });
                  setPicker(undefined);
                }}
                variant="outlined"
              />
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
                <Button
                  label="Save dialogue"
                  onPress={() => {
                    if (selectedObjectId) updateObject(selectedObjectId, { dialogue: dialogueDraft.trim() || undefined });
                    setPicker(undefined);
                  }}
                />
              </>
            ) : null}
            <Button label="Cancel" onPress={() => setPicker(undefined)} variant="text" />
          </Column>
        </BottomSheet>
      </Host>

    </ScrollView>
  );
}
