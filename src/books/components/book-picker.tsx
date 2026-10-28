import { Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BookCover } from '@/books/components/book-cover';
import type { Book } from '@/books/types';
import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';

type BookPickerProps = {
  books: Book[];
  selectedId: string;
  onSelect: (bookId: string) => void;
};

// Shows the selected book as a row; with more than one book, "Trocar" expands the list to switch.
export function BookPicker({ books, selectedId, onSelect }: BookPickerProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const [isOpen, setIsOpen] = useState(false);
  const selected = books.find((book) => book.id === selectedId);
  const canSwitch = books.length > 1;

  if (!selected) {
    return null;
  }

  function select(bookId: string) {
    onSelect(bookId);
    setIsOpen(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <BookCover book={selected} />
        <View style={styles.copy}>
          <Text style={styles.title} numberOfLines={1}>{selected.title}</Text>
          <Text style={styles.meta}>
            Parou na pág. {selected.currentPage} de {selected.totalPages} · cap. {selected.currentChapter}/{selected.chapters}
          </Text>
        </View>
        {canSwitch ? (
          <TouchableOpacity style={styles.switchButton} onPress={() => setIsOpen(!isOpen)} hitSlop={8}>
            <Text style={styles.switchText}>Trocar</Text>
            {isOpen ? <ChevronUp size={16} color={colors.accent} /> : <ChevronDown size={16} color={colors.accent} />}
          </TouchableOpacity>
        ) : null}
      </View>

      {isOpen
        ? books.map((book) => (
            <TouchableOpacity key={book.id} style={styles.option} onPress={() => select(book.id)}>
              <Text style={[styles.optionText, book.id === selectedId ? styles.optionTextSelected : undefined]} numberOfLines={1}>
                {book.title}
              </Text>
              {book.id === selectedId ? <Check size={18} color={colors.accent} /> : null}
            </TouchableOpacity>
          ))
        : null}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    container: {
      borderRadius: 14,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 12,
    },
    copy: {
      flex: 1,
      gap: 4,
    },
    title: {
      color: colors.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    meta: {
      color: colors.muted,
      fontSize: 13,
    },
    switchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    switchText: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '600',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.line,
    },
    optionText: {
      flex: 1,
      color: colors.ink,
      fontSize: 15,
    },
    optionTextSelected: {
      fontWeight: '700',
    },
  });
