import type { Book } from '@/books/types';
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
