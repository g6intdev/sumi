import { useColorScheme } from 'react-native';

const sharedColors = {
  accent: '#5B5BD6',
  danger: '#DC2626',
  canvasInk: '#24212B',
  canvasPaper: '#FFF9ED',
  canvasSky: '#BFE3FF',
  canvasSunset: '#FFD1BA',
  dialogue: '#FFFFFF',
  dialogueText: '#18181B',
  propPhone: '#3F3F46',
  propTable: '#A16207',
  propCup: '#F4F4F5',
} as const;

const colorSchemes = {
  light: {
    ...sharedColors,
    accentSoft: '#E8E8FF',
    avatar: '#D9D9F7',
    background: '#F7F7FA',
    surface: '#FFFFFF',
    textPrimary: '#18181B',
    textSecondary: '#71717A',
    border: '#E4E4E7',
  },
  dark: {
    ...sharedColors,
    accentSoft: '#25254A',
    avatar: '#30305C',
    background: '#09090B',
    surface: '#18181B',
    textPrimary: '#FAFAFA',
    textSecondary: '#A1A1AA',
    border: '#3F3F46',
  },
} as const;

export const spacing = {
  hairline: 2,
  tiny: 4,
  compact: 8,
  control: 12,
  section: 16,
  screenHorizontal: 24,
  screenTop: 24,
  contentGap: 18,
  screenBottom: 32,
} as const;

export const radii = {
  small: 6,
  avatar: 28,
  control: 12,
  surface: 16,
  pill: 999,
} as const;

export const typography = {
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  body: {
    fontSize: 17,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  caption: {
    fontSize: 13,
  },
} as const;

export const sizes = {
  canvasObject: 72,
  assetObject: 54,
  canvasBorder: 3,
  selectionBorder: 3,
  actionMinWidth: 92,
  modalMaxWidth: 420,
  avatar: 56,
  border: 1,
  selectedBorder: 2,
  buttonHeight: 50,
} as const;

export function useTheme() {
  const colorScheme = useColorScheme();

  return {
    colors: colorSchemes[colorScheme === 'dark' ? 'dark' : 'light'],
    radii,
    spacing,
    typography,
    sizes,
  };
}
