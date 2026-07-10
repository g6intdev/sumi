import { useColorScheme } from 'react-native';

const sharedColors = {
  accent: '#5B5BD6',
  danger: '#DC2626',
} as const;

const colorSchemes = {
  light: {
    ...sharedColors,
    background: '#F7F7FA',
    surface: '#FFFFFF',
    textPrimary: '#18181B',
    textSecondary: '#71717A',
    border: '#E4E4E7',
  },
  dark: {
    ...sharedColors,
    background: '#09090B',
    surface: '#18181B',
    textPrimary: '#FAFAFA',
    textSecondary: '#A1A1AA',
    border: '#3F3F46',
  },
} as const;

export const spacing = {
  screenHorizontal: 24,
  contentGap: 18,
} as const;

export const radii = {
  surface: 16,
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
} as const;

export function useTheme() {
  const colorScheme = useColorScheme();

  return {
    colors: colorSchemes[colorScheme === 'dark' ? 'dark' : 'light'],
    radii,
    spacing,
    typography,
  };
}
