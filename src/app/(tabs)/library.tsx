import { BottomSheet, Button, Column, Host, Row, Spacer, Text as NativeText, TextInput as NativeTextInput } from '@expo/ui';
import { MenuView } from '@expo/ui/community/menu';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

import { ComicExportCanvas } from '@/components/comic-export-canvas';
import { ComicPanelCanvas } from '@/components/comic-panel-canvas';
import { deleteComic, saveComic, useComicLibrary } from '@/storage/comic-library';
import { useTheme } from '@/theme/theme';
import type { SavedComic } from '@/types/comic';

function ComicCard({ comic, comicWidth, panelHeight, panelWidth, previewWidth }: {
  comic: SavedComic;
  comicWidth: number;
  panelHeight: number;
  panelWidth: number;
  previewWidth: number;
}) {
  const router = useRouter();
  const exportRef = useRef<View>(null);
  const [webMenuOpen, setWebMenuOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(comic.name);
  const [renameOpen, setRenameOpen] = useState(false);
  const { colors, radii, sizes, spacing, typography } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const renameFieldWidth = Math.min(sizes.modalMaxWidth, windowWidth - spacing.screenHorizontal * 2);

  const openComic = () => router.push({
    pathname: '/comic-preview',
    params: {
      characters: JSON.stringify(comic.characters),
      backgroundColor: comic.backgroundColor,
      comicId: comic.id,
      createdAt: comic.createdAt,
      panels: JSON.stringify(comic.panels),
    },
  });

  const confirmDelete = () => {
    const remove = () => deleteComic(comic.id);
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('Are you sure? This action cannot be undone')) remove();
      return;
    }
    Alert.alert('Delete comic?', 'Are you sure? This action cannot be undone', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: remove },
    ]);
  };

  const editName = () => {
    setWebMenuOpen(false);
    setNameDraft(comic.name);
    setRenameOpen(true);
  };

  const commitName = () => {
    const name = nameDraft.trim();
    if (!name) return;
    saveComic({ ...comic, name });
    setRenameOpen(false);
  };

  const exportComic = async () => {
    setWebMenuOpen(false);
    try {
      const uri = await captureRef(exportRef, {
        format: 'png',
        quality: 1,
        result: Platform.OS === 'web' ? 'data-uri' : 'tmpfile',
      });
      if (Platform.OS === 'web') {
        const anchor = document.createElement('a');
        anchor.download = `comic-${comic.id}.png`;
        anchor.href = uri;
        anchor.click();
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', UTI: 'public.png' });
      }
    } catch {
      Alert.alert('Could not export comic', 'Please try again.');
    }
  };

  const card = (
    <Pressable
      accessibilityHint="Opens the comic preview, where you can edit its panels"
      accessibilityLabel={`Open ${comic.name} from ${new Date(comic.createdAt).toLocaleString()}`}
      accessibilityRole="button"
      onPress={openComic}
      style={({ pressed }) => ({
        alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border,
        borderCurve: 'continuous', borderRadius: radii.surface, borderWidth: sizes.border,
        gap: spacing.control, opacity: pressed ? 0.7 : 1, padding: spacing.section, width: comicWidth,
      })}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{
        backgroundColor: comic.backgroundColor, borderCurve: 'continuous', borderRadius: radii.control,
        gap: spacing.compact, padding: spacing.compact, width: previewWidth,
      }}>
        {Array.from({ length: 4 }, (_, index) => (
          <ComicPanelCanvas height={panelHeight} interactive={false} key={index} onMoveObject={() => {}}
            onSelectObject={() => {}} panel={comic.panels[index] ?? { objects: [] }} width={panelWidth} />
        ))}
      </View>
      <Text style={{ color: colors.textPrimary, ...typography.label }}>{comic.name}</Text>
      <Text style={{ color: colors.textSecondary, ...typography.caption }}>{new Date(comic.createdAt).toLocaleString()}</Text>
    </Pressable>
  );

  return (
    <View style={{ position: 'relative' }}>
      {Platform.OS === 'web' ? (
        <>
          {card}
          <Pressable
            accessibilityLabel="Comic actions"
            accessibilityRole="button"
            onPress={() => setWebMenuOpen((open) => !open)}
            style={({ pressed }) => ({
              alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border,
              borderRadius: radii.pill, borderWidth: sizes.border, height: sizes.contextMenuButton,
              justifyContent: 'center', opacity: pressed ? 0.7 : 1, position: 'absolute',
              right: spacing.compact, top: spacing.compact, width: sizes.contextMenuButton,
            })}>
            <Text style={{ color: colors.textPrimary, ...typography.label }}>•••</Text>
          </Pressable>
          {webMenuOpen ? (
            <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.control,
              borderWidth: sizes.border, boxShadow: '0 6px 20px rgba(0,0,0,0.18)', minWidth: sizes.contextMenuWidth,
              padding: spacing.tiny, position: 'absolute', right: spacing.compact,
              top: sizes.contextMenuButton + spacing.control, zIndex: 1 }}>
              <Pressable onPress={editName} style={{ padding: spacing.control }}><Text style={{ color: colors.textPrimary, ...typography.label }}>Edit name</Text></Pressable>
              <Pressable onPress={exportComic} style={{ padding: spacing.control }}><Text style={{ color: colors.textPrimary, ...typography.label }}>Export</Text></Pressable>
              <Pressable onPress={() => { setWebMenuOpen(false); confirmDelete(); }} style={{ padding: spacing.control }}><Text style={{ color: colors.danger, ...typography.label }}>Delete</Text></Pressable>
            </View>
          ) : null}
        </>
      ) : (
        <MenuView shouldOpenOnLongPress actions={[
          { id: 'edit-name', title: 'Edit name', image: 'pencil' },
          { id: 'export', title: 'Export', image: 'square.and.arrow.up' },
          { id: 'delete', title: 'Delete', image: 'trash', attributes: { destructive: true } },
        ]} onPressAction={({ nativeEvent }) => {
          if (nativeEvent.event === 'edit-name') editName();
          else if (nativeEvent.event === 'export') exportComic();
          else confirmDelete();
        }}>
          {card}
        </MenuView>
      )}
      <Host matchContents seedColor={colors.accent}>
        <BottomSheet isPresented={renameOpen} onDismiss={() => setRenameOpen(false)} showDragIndicator>
          <Column alignment="start" spacing={spacing.section} style={{ padding: spacing.screenHorizontal }}>
            <Row spacing={spacing.control}>
              <Button label="×" onPress={() => setRenameOpen(false)} variant="outlined" />
              <Spacer />
              <NativeText textStyle={{ color: colors.textPrimary, ...typography.label }}>Edit name</NativeText>
              <Spacer />
              <Button label="Save" onPress={commitName} variant="filled" />
            </Row>
            <NativeTextInput
              autoCapitalize="words"
              autoFocus
              defaultValue={nameDraft}
              key={`${comic.id}-${renameOpen}`}
              onChangeText={setNameDraft}
              onSubmitEditing={commitName}
              placeholder="Comic name"
              placeholderTextColor={colors.textSecondary}
              returnKeyType="done"
              selectTextOnFocus
              style={{ backgroundColor: colors.background, borderColor: colors.border, borderRadius: radii.control,
                borderWidth: sizes.border, padding: spacing.control, width: renameFieldWidth }}
              textStyle={{ color: colors.textPrimary, ...typography.body }}
            />
          </Column>
        </BottomSheet>
      </Host>
      <View pointerEvents="none" style={{ left: -10000, position: 'absolute', top: 0 }}>
        <ComicExportCanvas comic={comic} ref={exportRef} />
      </View>
    </View>
  );
}

export default function LibraryScreen() {
  const comics = useComicLibrary();
  const { colors, sizes, spacing, typography } = useTheme();
  const { width } = useWindowDimensions();
  const libraryWidth = Math.max(0, width - spacing.screenHorizontal * 2);
  const columnCount = Math.max(1, Math.floor((libraryWidth + spacing.contentGap) / (sizes.libraryComicMinWidth + spacing.contentGap)));
  const comicWidth = (libraryWidth - spacing.contentGap * (columnCount - 1)) / columnCount;
  const previewWidth = Math.max(0, comicWidth - spacing.section * 2);
  const panelWidth = Math.max(0, previewWidth - spacing.compact * 2);
  const panelHeight = panelWidth / sizes.panelAspectRatio;

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ gap: spacing.contentGap, padding: spacing.screenHorizontal, paddingBottom: spacing.screenBottom }}>
      <Text style={{ color: colors.textPrimary, ...typography.title }}>My Comics</Text>
      {comics.length === 0 ? <Text style={{ color: colors.textSecondary, ...typography.body }}>No comics yet</Text> : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.contentGap }}>
          {comics.map((comic) => <ComicCard comic={comic} comicWidth={comicWidth} key={comic.id}
            panelHeight={panelHeight} panelWidth={panelWidth} previewWidth={previewWidth} />)}
        </View>
      )}
    </ScrollView>
  );
}
