import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { ActionButton } from '@/components/app/action-button';
import { EmptyState } from '@/components/app/empty-state';
import { KeyboardAwareScrollView } from '@/components/app/keyboard-aware-scroll-view';
import { FormField } from '@/components/reading/form-field';
import { ReadingColors } from '@/constants/theme';
import { useReadingStore } from '@/store/reading-store';

const readingSchema = z.object({
  bookId: z.string().min(1, 'Escolha um livro.'),
  fromPage: z.coerce.number().int().min(0, 'Informe a página inicial.'),
  toPage: z.coerce.number().int().min(1, 'Informe a página final.'),
  minutesRead: z.coerce.number().int().min(1, 'Informe o tempo de leitura.'),
  chapter: z.coerce.number().int().min(1, 'Informe o capítulo.'),
  note: z.string().trim().optional(),
}).refine((value) => value.toPage > value.fromPage, {
  path: ['toPage'],
  message: 'A página final precisa ser maior que a inicial.',
});

type ReadingForm = z.infer<typeof readingSchema>;
type FormErrors = Partial<Record<keyof ReadingForm, string>>;

export default function LogReadingScreen() {
  const { bookId: routeBookId } = useLocalSearchParams<{ bookId?: string }>();
  // Select the stable array and filter outside: a selector returning a new array loops forever in Zustand 5.
  const allBooks = useReadingStore((state) => state.books);
  const books = allBooks.filter((book) => !book.finishedAt);
  const addReading = useReadingStore((state) => state.addReading);
  const initialBook = books.find((book) => book.id === routeBookId) ?? books[0];
  const [bookId, setBookId] = useState(initialBook?.id ?? '');
  const selectedBook = books.find((book) => book.id === bookId);
  const [fromPage, setFromPage] = useState(initialBook?.currentPage.toString() ?? '0');
  const [toPage, setToPage] = useState('');
  const [minutesRead, setMinutesRead] = useState('');
  const [chapter, setChapter] = useState(initialBook?.currentChapter.toString() ?? '1');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function selectBook(id: string) {
    const book = books.find((item) => item.id === id);

    setBookId(id);
    setFromPage(book?.currentPage.toString() ?? '0');
    setToPage('');
    setChapter(book?.currentChapter.toString() ?? '1');
  }

  function submit() {
    const result = readingSchema.safeParse({ bookId, fromPage, toPage, minutesRead, chapter, note });

    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as FormErrors);
      return;
    }

    if (!selectedBook) {
      setErrors({ bookId: 'Escolha um livro.' });
      return;
    }

    if (result.data.toPage > selectedBook.totalPages) {
      setErrors({ toPage: `A página final não pode passar de ${selectedBook.totalPages}.` });
      return;
    }

    if (result.data.chapter > selectedBook.chapters) {
      setErrors({ chapter: `Este livro tem ${selectedBook.chapters} capítulos.` });
      return;
    }

    setErrors({});
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addReading({
      ...result.data,
      note: result.data.note || undefined,
    });
    router.back();
  }

  if (books.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.emptyState}>
          <EmptyState
            actionLabel="Adicionar livro"
            description="Para registrar uma leitura, primeiro adicione um livro em andamento."
            icon={<BookOpen size={28} color={ReadingColors.accent} />}
            onAction={() => router.replace('/add-book')}
            title="Nenhum livro em leitura"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Livro</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bookList}>
            {books.map((book) => {
              const isSelected = book.id === bookId;

              return (
                <TouchableOpacity
                  key={book.id}
                  style={[styles.bookPill, isSelected ? styles.bookPillSelected : undefined]}
                  onPress={() => selectBook(book.id)}>
                  <Text style={[styles.bookPillText, isSelected ? styles.bookPillTextSelected : undefined]} numberOfLines={1}>
                    {book.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {errors.bookId ? <Text style={styles.error}>{errors.bookId}</Text> : null}
        </View>

        <View style={styles.row}>
          <FormField
            label="Da página"
            value={fromPage}
            onChangeText={setFromPage}
            keyboardType="number-pad"
            error={errors.fromPage}
            containerStyle={styles.rowInput}
            placeholder="Ex: 0"
          />
          <FormField
            label="Até a página"
            value={toPage}
            onChangeText={setToPage}
            keyboardType="number-pad"
            error={errors.toPage}
            containerStyle={styles.rowInput}
            placeholder="Ex: 32"
          />
        </View>

        <View style={styles.row}>
          <FormField
            label="Minutos"
            value={minutesRead}
            onChangeText={setMinutesRead}
            keyboardType="number-pad"
            error={errors.minutesRead}
            containerStyle={styles.rowInput}
            placeholder="Ex: 45"
          />
          <FormField
            label="Capítulo"
            value={chapter}
            onChangeText={setChapter}
            keyboardType="number-pad"
            error={errors.chapter}
            containerStyle={styles.rowInput}
            placeholder="Ex: 3"
          />
        </View>

        <FormField
          label="Nota (opcional)"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholder="Ex: leitura antes de dormir"
          style={styles.noteInput}
        />

        <ActionButton label="Salvar leitura" onPress={submit} style={styles.submit} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ReadingColors.background,
  },
  container: {
    gap: 16,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: ReadingColors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  bookList: {
    gap: 8,
  },
  bookPill: {
    maxWidth: 220,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: ReadingColors.surface,
  },
  bookPillSelected: {
    backgroundColor: ReadingColors.accent,
  },
  bookPillText: {
    color: ReadingColors.ink,
    fontSize: 14,
    fontWeight: '600',
  },
  bookPillTextSelected: {
    color: ReadingColors.white,
  },
  error: {
    color: ReadingColors.danger,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowInput: {
    flex: 1,
  },
  noteInput: {
    minHeight: 96,
    paddingTop: 14,
  },
  submit: {
    marginTop: 12,
  },
});
