import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cast-setup" options={{ title: 'Choose your characters' }} />
      <Stack.Screen name="comic-creator" options={{ title: 'Panel Editor' }} />
    </Stack>
    </GestureHandlerRootView>
  );
}
