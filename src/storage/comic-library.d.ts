import type { SavedComic } from '@/types/comic';

export function getComic(id: string): SavedComic | undefined;
export function saveComic(comic: SavedComic): void;
export function duplicateComic(comic: SavedComic): SavedComic;
export function deleteComic(id: string): void;
export function useComicLibrary(): SavedComic[];
