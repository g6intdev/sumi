import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cast-setup" options={{ title: 'Choose your characters' }} />
      <Stack.Screen name="comic-creator" options={{ title: 'Comic Creator' }} />
    </Stack>
  );
}
