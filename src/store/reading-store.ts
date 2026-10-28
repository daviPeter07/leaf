import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { AddBookInput, Book, UpdateBookInput } from '@/books/types';
import { COVER_PAIRS } from '@/books/utils/constants';
import { createId } from '@/books/utils/functions';
import type { AddReadingInput, ReadingSession } from '@/reading/types';

type ReadingState = {
  readerName: string;
  hasSeenTutorial: boolean;
  books: Book[];
  sessions: ReadingSession[];
  addBook: (input: AddBookInput) => void;
  addReading: (input: AddReadingInput) => void;
  updateBook: (input: UpdateBookInput) => void;
  removeBook: (bookId: string) => void;
  finishBook: (bookId: string) => void;
  completeTutorial: () => void;
};

export const useReadingStore = create<ReadingState>()(
  persist(
    (set, get) => ({
      readerName: 'Alice',
      hasSeenTutorial: false,
      books: [],
      sessions: [],
      addBook: ({ title, author, totalPages, chapters, currentPage = 0 }) => {
        const colors = COVER_PAIRS[get().books.length % COVER_PAIRS.length];
        const safeCurrentPage = Math.min(Math.max(0, currentPage), totalPages);
        const progress = safeCurrentPage / totalPages;
        const currentChapter = safeCurrentPage > 0 ? Math.min(chapters, Math.max(1, Math.ceil(progress * chapters))) : 1;

        const book: Book = {
          id: createId(title),
          title: title.trim(),
          author: author.trim(),
          totalPages,
          currentPage: safeCurrentPage,
          chapters,
          currentChapter,
          coverColor: colors.coverColor,
          accentColor: colors.accentColor,
          startedAt: new Date().toISOString(),
          finishedAt: safeCurrentPage === totalPages ? new Date().toISOString() : undefined,
        };

        set((state) => ({ books: [book, ...state.books] }));
      },
      addReading: ({ bookId, pagesRead, minutesRead, fromPage: inputFromPage, toPage: inputToPage, chapter, note }) => {
        const book = get().books.find((item) => item.id === bookId);

        if (!book) {
          return;
        }

        const fromPage = Math.min(book.totalPages, Math.max(0, inputFromPage ?? book.currentPage));
        const toPage = Math.min(book.totalPages, inputToPage ?? fromPage + (pagesRead ?? 0));
        const actualPagesRead = Math.max(0, toPage - fromPage);

        if (actualPagesRead === 0) {
          return;
        }

        const progress = toPage / book.totalPages;
        const currentChapter = Math.min(
          book.chapters,
          Math.max(book.currentChapter, chapter ?? Math.ceil(progress * book.chapters))
        );
        const date = new Date().toISOString();
        const session: ReadingSession = {
          id: `session-${Date.now()}`,
          bookId,
          date,
          pagesRead: actualPagesRead,
          minutesRead,
          fromPage,
          toPage,
          chapter: currentChapter,
          note,
        };

        set((state) => ({
          books: state.books.map((item) =>
            item.id === bookId
              ? {
                  ...item,
                  currentPage: Math.max(item.currentPage, toPage),
                  currentChapter,
                  finishedAt: toPage === item.totalPages ? date : item.finishedAt,
                }
              : item
          ),
          sessions: [session, ...state.sessions],
        }));
      },
      updateBook: ({ id, ...updates }) => {
        set((state) => ({
          books: state.books.map((book) => {
            if (book.id !== id) {
              return book;
            }

            const totalPages = updates.totalPages ?? book.totalPages;
            const chapters = updates.chapters ?? book.chapters;
            const currentPage = Math.min(Math.max(0, updates.currentPage ?? book.currentPage), totalPages);
            const currentChapter = Math.min(Math.max(1, updates.currentChapter ?? book.currentChapter), chapters);

            return {
              ...book,
              ...updates,
              totalPages,
              chapters,
              currentPage,
              currentChapter,
              title: updates.title?.trim() ?? book.title,
              author: updates.author?.trim() ?? book.author,
              finishedAt: currentPage === totalPages ? updates.finishedAt ?? book.finishedAt ?? new Date().toISOString() : updates.finishedAt,
            };
          }),
        }));
      },
      removeBook: (bookId) => {
        set((state) => ({
          books: state.books.filter((book) => book.id !== bookId),
          sessions: state.sessions.filter((session) => session.bookId !== bookId),
        }));
      },
      finishBook: (bookId) => {
        const finishedAt = new Date().toISOString();

        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? {
                  ...book,
                  currentPage: book.totalPages,
                  currentChapter: book.chapters,
                  finishedAt,
                }
              : book
          ),
        }));
      },
      completeTutorial: () => {
        set({ hasSeenTutorial: true });
      },
    }),
    {
      name: 'leaf-reading-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// AsyncStorage loads asynchronously, so screens must wait for it before trusting persisted flags.
export function useReadingStoreHydrated() {
  return useSyncExternalStore(
    (onChange) => useReadingStore.persist.onFinishHydration(onChange),
    () => useReadingStore.persist.hasHydrated()
  );
}

export type { Book, ReadingSession };
