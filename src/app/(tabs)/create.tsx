import { Button } from '@expo/ui';
import { router } from 'expo-router';

import { AppScreen } from '@/components/app-screen';

export default function CreateScreen() {
  return (
    <AppScreen title="Create Manga">
      <Button label="New Comic" onPress={() => router.push('/cast-setup')} />
    </AppScreen>
  );
}
