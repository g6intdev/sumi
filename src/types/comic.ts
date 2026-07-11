import type { SelectedCharacter } from '@/types/character';
import type { Panel } from '@/types/editor';

export type SavedComic = {
  characters: SelectedCharacter[];
  createdAt: string;
  id: string;
  panels: Panel[];
};
