export type Book = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  chapters: number;
  currentChapter: number;
  coverColor: string;
  accentColor: string;
  startedAt: string;
  finishedAt?: string;
};

export type ReadingSession = {
  id: string;
  bookId: string;
  date: string;
  pagesRead: number;
  minutesRead: number;
  fromPage: number;
  toPage: number;
  chapter: number;
  note?: string;
};

export type AddReadingInput = {
  bookId: string;
  pagesRead?: number;
  minutesRead: number;
  fromPage?: number;
  toPage?: number;
  chapter?: number;
  note?: string;
};

export type AddBookInput = {
  title: string;
  author: string;
  totalPages: number;
  chapters: number;
  currentPage?: number;
};

export type UpdateBookInput = Partial<Omit<Book, 'id' | 'startedAt'>> & {
  id: string;
};
