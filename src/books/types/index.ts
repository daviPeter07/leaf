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
