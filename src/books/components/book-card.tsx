import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BookCover } from '@/books/components/book-cover';
import { ReadingColors } from '@/constants/theme';
import type { Book } from '@/books/types';
import { getBookProgress } from '@/books/utils/functions';

type BookCardProps = {
  book: Book;
  onPress?: () => void;
};

export function BookCard({ book, onPress }: BookCardProps) {
  const progress = getBookProgress(book);

  const content = (
    <>
      <BookCover book={book} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        {book.finishedAt ? (
          <Text style={styles.finished}>Finalizado</Text>
        ) : (
          <>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.meta}>
              {book.currentPage} de {book.totalPages} págs. · {progress}%
            </Text>
          </>
        )}
      </View>
      {onPress ? <ChevronRight size={20} color={ReadingColors.muted} /> : null}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: ReadingColors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  author: {
    color: ReadingColors.muted,
    fontSize: 14,
  },
  progressTrack: {
    height: 4,
    marginTop: 6,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: ReadingColors.surface,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: ReadingColors.accent,
  },
  meta: {
    color: ReadingColors.muted,
    fontSize: 12,
  },
  finished: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: ReadingColors.accentSoft,
    color: ReadingColors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
