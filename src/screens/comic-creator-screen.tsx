import { BottomSheet, Button as NativeButton, Column, Host, Text as NativeText, TextInput as NativeTextInput } from '@expo/ui';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';

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
  const { width: windowWidth } = useWindowDimensions();
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
  const canvasWidth = Math.max(0, windowWidth - spacing.screenHorizontal * 2);
  const canvasHeight = canvasWidth * 0.72;

  function updateObject(id: string, update: Partial<CanvasObject>) {
    setPanel((current) => ({ ...current, objects: current.objects.map((object) => object.id === id ? { ...object, ...update } : object) }));
  }

  function addObject(type: CanvasObject['type'], assetId: string) {
    const objectSize = type === 'character' ? sizes.canvasObject : sizes.assetObject;
    const id = `${type}-${nextObjectId}`;
    setNextObjectId((current) => current + 1);
    const object: CanvasObject = { id, type, assetId, width: objectSize, height: objectSize, x: (canvasWidth - objectSize) / 2, y: (canvasHeight - objectSize) / 2 };
    setPanel((current) => ({ ...current, objects: [...current.objects, object] }));
    setSelectedObjectId(id);
    setPicker(undefined);
  }

  function deleteSelected() {
    setPanel((current) => ({ ...current, objects: current.objects.filter((object) => object.id !== selectedObjectId) }));
    setSelectedObjectId(undefined);
  }

  const action = (label: string, onPress: () => void, danger = false) => (
    <Pressable
      accessibilityRole="button"
      key={label}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: 'center', backgroundColor: danger ? colors.danger : colors.surface,
        borderColor: danger ? colors.danger : colors.border, borderRadius: radii.control,
        borderWidth: sizes.border, minWidth: sizes.actionMinWidth, opacity: pressed ? 0.7 : 1,
        paddingHorizontal: spacing.control, paddingVertical: spacing.control,
      })}>
      <Text style={{ color: danger ? colors.dialogue : colors.textPrimary, ...typography.label }}>{label}</Text>
    </Pressable>
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
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ alignItems: 'center', gap: spacing.contentGap, paddingHorizontal: spacing.screenHorizontal, paddingBottom: spacing.screenBottom }}>
      <Text selectable style={{ alignSelf: 'flex-start', color: colors.textPrimary, ...typography.title }}>Panel 1 of 4</Text>
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
              <NativeButton key={character.id} label={character.id} onPress={() => chooseNativeItem('character', character.id)} variant="outlined" />
            )) : null}
            {picker === 'character' && characters.length === 0 ? (
              <NativeText textStyle={{ color: colors.textSecondary, ...typography.body }}>
                No cast members were selected.
              </NativeText>
            ) : null}
            {picker === 'background' ? choices.background.map((choice) => (
              <NativeButton key={choice.id} label={choice.label} onPress={() => chooseNativeItem('background', choice.id)} variant="outlined" />
            )) : null}
            {picker === 'asset' ? choices.asset.map((choice) => (
              <NativeButton key={choice.id} label={choice.label} onPress={() => chooseNativeItem('asset', choice.id)} variant="outlined" />
            )) : null}
            {picker === 'expression' ? choices.expression.map((choice) => (
              <NativeButton
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
                <NativeButton
                  label="Save dialogue"
                  onPress={() => {
                    if (selectedObjectId) updateObject(selectedObjectId, { dialogue: dialogueDraft.trim() || undefined });
                    setPicker(undefined);
                  }}
                />
              </>
            ) : null}
            <NativeButton label="Cancel" onPress={() => setPicker(undefined)} variant="text" />
          </Column>
        </BottomSheet>
      </Host>

    </ScrollView>
  );
}
