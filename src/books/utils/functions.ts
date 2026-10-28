import type { Book, BookSearchResult } from '@/books/types';
import {
  BOOK_SEARCH_LIMIT,
  OPEN_LIBRARY_COVER_URL,
  OPEN_LIBRARY_FIELDS,
  OPEN_LIBRARY_SEARCH_URL,
} from '@/books/utils/constants';
import { openLibrarySearchSchema } from '@/books/utils/zod';
import type { ReadingSession } from '@/reading/types';

export function createId(value: string) {
  return `${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
}

export function getBookProgress(book: Book) {
  return book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
}

export function getBookTotals(bookId: string, sessions: ReadingSession[]) {
  const bookSessions = sessions.filter((session) => session.bookId === bookId);

  return {
    sessions: bookSessions,
    pages: bookSessions.reduce((total, session) => total + session.pagesRead, 0),
    minutes: bookSessions.reduce((total, session) => total + session.minutesRead, 0),
  };
}

// Lets the reader type title and author together however they like ("Dom Casmurro - Machado", "1984 by Orwell").
// Open Library reads the query as Lucene syntax, where a leading "-" excludes a word, so "Título - Autor" would
// find nothing. Punctuation becomes spaces and "por"/"by" between title and author are dropped.
export function normalizeSearchQuery(query: string) {
  return query
    .replace(/[()[\]{}"~*?:\\/|,;—–^!+]/g, ' ')
    .replace(/(^|\s)-+/g, ' ')
    .replace(/\s(?:por|by)\s/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function searchBooks(query: string, signal?: AbortSignal): Promise<BookSearchResult[]> {
  const params = new URLSearchParams({ q: normalizeSearchQuery(query), fields: OPEN_LIBRARY_FIELDS, limit: String(BOOK_SEARCH_LIMIT) });
  const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params}`, {
    signal,
    headers: { 'User-Agent': 'Leaf/1.0 (https://github.com/daviPeter07/leaf)' },
  });

  if (!response.ok) {
    throw new Error(`Open Library respondeu ${response.status}`);
  }

  const { docs } = openLibrarySearchSchema.parse(await response.json());

  return docs.map((doc) => ({
    id: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? '',
    totalPages: doc.number_of_pages_median ?? undefined,
    coverUrl: doc.cover_i ? `${OPEN_LIBRARY_COVER_URL}/${doc.cover_i}-M.jpg` : undefined,
  }));
}
