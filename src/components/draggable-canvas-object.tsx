import type { PropsWithChildren } from 'react';
import { Pressable } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

type DraggableCanvasObjectProps = PropsWithChildren<{
  canvasHeight: number;
  canvasWidth: number;
  height: number;
  isSelected: boolean;
  onMove: (x: number, y: number) => void;
  onSelect: () => void;
  width: number;
  x: number;
  y: number;
}>;

const clamp = (value: number, minimum: number, maximum: number) => {
  'worklet';
  return Math.min(Math.max(value, minimum), maximum);
};

export function DraggableCanvasObject({
  canvasHeight,
  canvasWidth,
  children,
  height,
  isSelected,
  onMove,
  onSelect,
  width,
  x,
  y,
}: DraggableCanvasObjectProps) {
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const originX = useSharedValue(x);
  const originY = useSharedValue(y);

  // Translation is clamped against the measured panel and the object's own size.
  const pan = Gesture.Pan()
    .onBegin(() => {
      originX.value = translateX.value;
      originY.value = translateY.value;
      runOnJS(onSelect)();
    })
    .onUpdate((event) => {
      translateX.value = clamp(originX.value + event.translationX, 0, canvasWidth - width);
      translateY.value = clamp(originY.value + event.translationY, 0, canvasHeight - height);
    })
    .onEnd(() => runOnJS(onMove)(translateX.value, translateY.value));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          { position: 'absolute', left: 0, top: 0, width, height },
          animatedStyle,
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isSelected }}
          onPress={onSelect}
          style={{ flex: 1 }}>
          {children}
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
}
