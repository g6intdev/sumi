import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTheme } from '@/theme/theme';

export default function RootLayout() {
  const { colors } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="cast-setup"
        options={{
          headerLargeTitleEnabled: true,
          headerLargeTitleStyle: { color: colors.textPrimary },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { color: colors.textPrimary },
          title: 'Choose your characters',
        }}
      />
      <Stack.Screen
        name="comic-creator"
        options={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { color: colors.textPrimary },
          title: 'Panel Editor',
        }}
      />
      <Stack.Screen
        name="comic-preview"
        options={{
          headerLargeTitleEnabled: true,
          title: 'Preview',
        }}
      />
    </Stack>
    </GestureHandlerRootView>
  );
}
