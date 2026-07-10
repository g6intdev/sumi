import { Host, Text } from '@expo/ui';
import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme';

type AppScreenProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

export function AppScreen({ children, subtitle, title }: AppScreenProps) {
  const { colors, spacing, typography } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top', 'left', 'right']}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.contentGap,
          paddingHorizontal: spacing.screenHorizontal,
        }}>
        <Host matchContents seedColor={colors.accent}>
          <Text
            textStyle={{
              color: colors.textPrimary,
              ...typography.title,
              textAlign: 'center',
            }}>
            {title}
          </Text>

          {subtitle ? (
            <Text
              textStyle={{
                color: colors.textSecondary,
                ...typography.body,
                textAlign: 'center',
              }}>
              {subtitle}
            </Text>
          ) : null}

          {children}
        </Host>
      </View>
    </SafeAreaView>
  );
}
