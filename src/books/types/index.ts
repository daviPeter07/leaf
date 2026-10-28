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
  // Cover image from the book search; books added by hand use coverColor instead.
  coverUrl?: string;
  startedAt: string;
  finishedAt?: string;
};

export type AddBookInput = {
  title: string;
  author: string;
  totalPages: number;
  chapters: number;
  currentPage?: number;
  coverUrl?: string;
};

export type BookSearchResult = {
  id: string;
  title: string;
  author: string;
  totalPages?: number;
  coverUrl?: string;
};

export type UpdateBookInput = Partial<Omit<Book, 'id' | 'startedAt'>> & {
  id: string;
};
