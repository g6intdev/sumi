import { useSyncExternalStore } from 'react';

import type { SavedComic } from '@/types/comic';

const storageKey = 'sumi.comic-library.v1';
const listeners = new Set<() => void>();

function readComics(): SavedComic[] {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(storageKey) ?? '[]') as SavedComic[];
  } catch {
    return [];
  }
}

let comics = readComics();

export function saveComic(comic: SavedComic) {
  comics = [comic, ...comics];
  try {
    globalThis.localStorage?.setItem(storageKey, JSON.stringify(comics));
  } catch {
    // Keep the in-memory copy available if browser storage is blocked or full.
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
