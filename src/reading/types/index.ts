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

export type ReadingDay = {
  key: string;
  pages: number;
  minutes: number;
  sessions: ReadingSession[];
};
