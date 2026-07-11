import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, useWindowDimensions } from 'react-native';

import { ComicPanelCanvas } from '@/components/comic-panel-canvas';
import { useComicLibrary } from '@/storage/comic-library';
import { useTheme } from '@/theme/theme';

export default function LibraryScreen() {
  const comics = useComicLibrary();
  const { colors, radii, sizes, spacing, typography } = useTheme();
  const { width } = useWindowDimensions();
  const previewWidth = Math.max(0, Math.min(width - spacing.screenHorizontal * 4, sizes.modalMaxWidth));
  const previewHeight = previewWidth / sizes.panelAspectRatio;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ gap: spacing.contentGap, padding: spacing.screenHorizontal, paddingBottom: spacing.screenBottom }}>
      <Text style={{ color: colors.textPrimary, ...typography.title }}>My Comics</Text>
      {comics.length === 0 ? (
        <Text style={{ color: colors.textSecondary, ...typography.body }}>No comics yet</Text>
      ) : comics.map((comic) => (
        <Link
          asChild
          href={{
            pathname: '/comic-preview',
            params: {
              characters: JSON.stringify(comic.characters),
              comicId: comic.id,
              createdAt: comic.createdAt,
              panels: JSON.stringify(comic.panels),
            },
          }}
          key={comic.id}>
          <Pressable
            accessibilityHint="Opens the comic preview, where you can edit its panels"
            accessibilityLabel={`Open comic from ${new Date(comic.createdAt).toLocaleString()}`}
            accessibilityRole="button"
            style={({ pressed }) => ({
              alignItems: 'center',
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderCurve: 'continuous',
              borderRadius: radii.surface,
              borderWidth: sizes.border,
              gap: spacing.control,
              opacity: pressed ? 0.7 : 1,
              padding: spacing.section,
            })}>
            <ComicPanelCanvas
              height={previewHeight}
              interactive={false}
              onMoveObject={() => {}}
              onSelectObject={() => {}}
              panel={comic.panels[0] ?? { objects: [] }}
              width={previewWidth}
            />
            <Text style={{ color: colors.textSecondary, ...typography.caption }}>
              {new Date(comic.createdAt).toLocaleString()}
            </Text>
          </Pressable>
        </Link>
      ))}
    </ScrollView>
  );
}
