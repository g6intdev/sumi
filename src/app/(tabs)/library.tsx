import { ScrollView, Text, View, useWindowDimensions } from 'react-native';

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
        <View
          key={comic.id}
          style={{
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderCurve: 'continuous',
            borderRadius: radii.surface,
            borderWidth: sizes.border,
            gap: spacing.control,
            padding: spacing.section,
          }}>
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
        </View>
      ))}
    </ScrollView>
  );
}
