import { useColorScheme } from 'react-native';

const sharedColors = {
  accent: '#5B5BD6',
  textOnAccent: '#FFFFFF',
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

export const comicBackgroundOptions = [
  { color: '#F4D8CD', label: 'Blush' },
  { color: '#D8E7F4', label: 'Sky' },
  { color: '#DCEAD7', label: 'Sage' },
  { color: '#E8DDF2', label: 'Lavender' },
  { color: '#F3E5C8', label: 'Sand' },
] as const;

export const comicBackgroundColors = comicBackgroundOptions.map(({ color }) => color);

export function getComicBackgroundColor(id: string) {
  const hash = Array.from(id).reduce((total, character) => total + character.charCodeAt(0), 0);
  return comicBackgroundColors[hash % comicBackgroundColors.length];
}

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
  comicExportPadding: 32,
  comicExportPanelGap: 12,
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
  floatingActionButton: 64,
  floatingActionIcon: 28,
  panelAspectRatio: 1 / 0.72,
  panelEditorChromeHeight: 226,
  libraryComicMinWidth: 150,
  comicExportWidth: 1200,
  contextMenuWidth: 144,
  contextMenuButton: 36,
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
