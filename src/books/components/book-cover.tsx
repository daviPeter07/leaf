import { BookOpen } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import type { Book } from '@/books/types';

type BookCoverProps = {
  book: Book;
  size?: 'small' | 'large';
};

export function BookCover({ book, size = 'small' }: BookCoverProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();

  const isLarge = size === 'large';

  return (
    <View style={[styles.cover, isLarge ? styles.large : styles.small, { backgroundColor: book.coverColor }]}>
      <BookOpen size={isLarge ? 34 : 22} color={colors.white} strokeWidth={2.2} />
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    cover: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
    },
    small: {
      width: 52,
      height: 74,
    },
    large: {
      width: 88,
      height: 128,
      borderRadius: 10,
    },
  });
