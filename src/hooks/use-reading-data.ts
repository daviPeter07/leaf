import { useReadingStore } from '@/store/reading-store';

export function useReadingData() {
  const readerName = useReadingStore((state) => state.readerName);
  const books = useReadingStore((state) => state.books);
  const sessions = useReadingStore((state) => state.sessions);
  const activeBook = books.find((book) => !book.finishedAt);

  return {
    readerName,
    books,
    sessions,
    activeBook,
  };
}
