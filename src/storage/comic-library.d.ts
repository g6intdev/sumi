import type { SavedComic } from '@/types/comic';

export function getComic(id: string): SavedComic | undefined;
export function saveComic(comic: SavedComic): void;
export function useComicLibrary(): SavedComic[];
