import { forwardRef } from 'react';
import { View } from 'react-native';

import { ComicPanelCanvas } from '@/components/comic-panel-canvas';
import { useTheme } from '@/theme/theme';
import type { SavedComic } from '@/types/comic';

type Props = { comic: SavedComic };

export const ComicExportCanvas = forwardRef<View, Props>(function ComicExportCanvas({ comic }, ref) {
  const { sizes, spacing } = useTheme();
  const panelWidth = sizes.comicExportWidth - spacing.comicExportPadding * 2;
  const panelHeight = panelWidth / sizes.panelAspectRatio;

  return (
    <View
      collapsable={false}
      ref={ref}
      style={{
        backgroundColor: comic.backgroundColor,
        gap: spacing.comicExportPanelGap,
        padding: spacing.comicExportPadding,
        width: sizes.comicExportWidth,
      }}>
      {Array.from({ length: 4 }, (_, index) => (
        <ComicPanelCanvas
          height={panelHeight}
          interactive={false}
          key={index}
          onMoveObject={() => {}}
          onSelectObject={() => {}}
          panel={comic.panels[index] ?? { objects: [] }}
          width={panelWidth}
        />
      ))}
    </View>
  );
});
