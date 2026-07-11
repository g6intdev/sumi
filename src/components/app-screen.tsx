import { Column, Host, Text } from '@expo/ui';
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
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: spacing.contentGap,
          paddingTop: spacing.screenTop,
          paddingHorizontal: spacing.screenHorizontal,
        }}>
        <Host matchContents seedColor={colors.accent}>
          <Column alignment="start" spacing={spacing.contentGap}>
            <Text
              textStyle={{
                color: colors.textPrimary,
                ...typography.title,
                textAlign: 'left',
              }}>
              {title}
            </Text>

            {subtitle ? (
              <Text
                textStyle={{
                  color: colors.textSecondary,
                  ...typography.body,
                  textAlign: 'left',
                }}>
                {subtitle}
              </Text>
            ) : null}

            {children}
          </Column>
        </Host>
      </View>
    </SafeAreaView>
  );
}
