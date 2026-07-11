import type { SelectedCharacter } from '@/types/character';
import type { Panel } from '@/types/editor';

export type SavedComic = {
  backgroundColor: string;
  characters: SelectedCharacter[];
  createdAt: string;
  id: string;
  panels: Panel[];
};
