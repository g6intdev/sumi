import { useSyncExternalStore } from 'react';

import type { SavedComic } from '@/types/comic';
import { getComicBackgroundColor } from '@/theme/theme';

const storageKey = 'sumi.comic-library.v1';
const listeners = new Set<() => void>();

function readComics(): SavedComic[] {
  try {
    const saved = JSON.parse(globalThis.localStorage?.getItem(storageKey) ?? '[]') as Partial<SavedComic>[];
    return saved
      .filter((comic): comic is Partial<SavedComic> & Pick<SavedComic, 'id'> => typeof comic.id === 'string')
      .map((comic) => ({ ...comic, backgroundColor: comic.backgroundColor ?? getComicBackgroundColor(comic.id) }) as SavedComic);
  } catch {
    return [];
  }
}

let comics = readComics();

export function getComic(id: string) {
  return comics.find((comic) => comic.id === id);
}

export function saveComic(comic: SavedComic) {
  const existingIndex = comics.findIndex((item) => item.id === comic.id);
  comics = existingIndex === -1
    ? [comic, ...comics]
    : comics.map((item, index) => index === existingIndex ? comic : item);
  try {
    globalThis.localStorage?.setItem(storageKey, JSON.stringify(comics));
  } catch {
    // Keep the in-memory copy available if browser storage is blocked or full.
  }
  listeners.forEach((listener) => listener());
}

export function deleteComic(id: string) {
  comics = comics.filter((comic) => comic.id !== id);
  try {
    globalThis.localStorage?.setItem(storageKey, JSON.stringify(comics));
  } catch {
    // Keep the in-memory copy updated if browser storage cannot be written.
  }
  listeners.forEach((listener) => listener());
}

export function useComicLibrary() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => comics,
    () => comics,
  );
}
