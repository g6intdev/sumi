import { Text, View } from 'react-native';

import { DraggableCanvasObject } from '@/components/draggable-canvas-object';
import { useTheme } from '@/theme/theme';
import type { CanvasObject, Panel } from '@/types/editor';

type ComicPanelCanvasProps = {
  height: number;
  onMoveObject: (id: string, x: number, y: number) => void;
  onSelectObject: (id?: string) => void;
  panel: Panel;
  selectedObjectId?: string;
  width: number;
};

const expressionEmoji: Record<string, string> = {
  happy: '😄',
  surprised: '😮',
  annoyed: '😒',
};

function AssetPlaceholder({ assetId }: { assetId: string }) {
  const { colors, radii, sizes, spacing, typography } = useTheme();
  if (assetId === 'table') {
    return <View style={{ backgroundColor: colors.propTable, borderRadius: radii.small, height: sizes.assetObject / 2, width: '100%' }} />;
  }
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <Text style={{ ...typography.title, fontSize: sizes.assetObject - spacing.section }}>
        {assetId === 'phone' ? '📱' : '☕'}
      </Text>
    </View>
  );
}

function CanvasItem({ object, selected }: { object: CanvasObject; selected: boolean }) {
  const { colors, radii, sizes, spacing, typography } = useTheme();
  const emoji = expressionEmoji[object.expressionId ?? ''] ?? '🙂';
  return (
    <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
      {object.type === 'character' ? (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.avatar,
            borderColor: selected ? colors.accent : 'transparent',
            borderRadius: radii.avatar,
            borderWidth: sizes.selectionBorder,
            flex: 1,
            justifyContent: 'center',
            width: '100%',
          }}>
          <Text style={{ ...typography.title }}>{emoji}</Text>
          <Text numberOfLines={1} style={{ color: colors.canvasInk, ...typography.caption, fontWeight: '700' }}>
            {object.assetId.replace('character-', '')}
          </Text>
        </View>
      ) : (
        <View
          style={{
            borderColor: selected ? colors.accent : 'transparent',
            borderRadius: radii.small,
            borderWidth: sizes.selectionBorder,
            flex: 1,
            padding: spacing.tiny,
            width: '100%',
          }}>
          <AssetPlaceholder assetId={object.assetId} />
        </View>
      )}
      {object.dialogue ? (
        <View
          pointerEvents="none"
          style={{
            backgroundColor: colors.dialogue,
            borderColor: colors.canvasInk,
            borderRadius: radii.control,
            borderWidth: sizes.border,
            bottom: object.height - spacing.tiny,
            left: object.width / 2,
            minWidth: object.width * 1.4,
            padding: spacing.compact,
            position: 'absolute',
          }}>
          <Text style={{ color: colors.dialogueText, ...typography.caption }}>{object.dialogue}</Text>
        </View>
      ) : null}
    </View>
  );
}

export function ComicPanelCanvas({ height, onMoveObject, onSelectObject, panel, selectedObjectId, width }: ComicPanelCanvasProps) {
  const { colors, sizes } = useTheme();
  const background = panel.backgroundId === 'sky' ? colors.canvasSky : panel.backgroundId === 'sunset' ? colors.canvasSunset : colors.canvasPaper;
  const contentWidth = Math.max(0, width - sizes.canvasBorder * 2);
  const contentHeight = Math.max(0, height - sizes.canvasBorder * 2);
  return (
    <View
      accessibilityLabel="Comic panel canvas"
      onTouchEnd={(event) => {
        if (event.target === event.currentTarget) onSelectObject(undefined);
      }}
      style={{
        backgroundColor: background,
        borderColor: colors.canvasInk,
        borderWidth: sizes.canvasBorder,
        height,
        overflow: 'hidden',
        position: 'relative',
        width,
      }}>
      {panel.objects.map((object) => {
        const pixelObject = {
          ...object,
          x: object.x * contentWidth,
          y: object.y * contentHeight,
          width: object.width * contentWidth,
          height: object.height * contentHeight,
        };

        return (
          <DraggableCanvasObject
          canvasHeight={contentHeight}
          canvasWidth={contentWidth}
          height={pixelObject.height}
          isSelected={selectedObjectId === object.id}
          key={object.id}
          onMove={(x, y) => onMoveObject(
            object.id,
            contentWidth > 0 ? x / contentWidth : 0,
            contentHeight > 0 ? y / contentHeight : 0,
          )}
          onSelect={() => onSelectObject(object.id)}
          width={pixelObject.width}
          x={pixelObject.x}
          y={pixelObject.y}>
          <CanvasItem object={pixelObject} selected={selectedObjectId === object.id} />
        </DraggableCanvasObject>
        );
      })}
    </View>
  );
}
