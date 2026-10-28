import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookPicker } from '@/books/components/book-picker';
import { ActionButton } from '@/components/app/action-button';
import { EmptyState } from '@/components/app/empty-state';
import { KeyboardAwareScrollView } from '@/components/app/keyboard-aware-scroll-view';
import { FormField } from '@/components/app/form-field';
import { NumberField } from '@/components/app/number-field';
import { StatRow } from '@/components/app/stat-row';
import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import { formatDuration, formatPace } from '@/reading/utils/functions';
import { readingSchema, type ReadingFormData } from '@/reading/utils/zod';
import { useReadingStore } from '@/store/reading-store';

type FormErrors = Partial<Record<keyof ReadingFormData, string>>;

export default function LogReadingScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();

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
  const startPage = Number.parseInt(fromPage, 10) || 0;
  const endPage = Number.parseInt(toPage, 10);
  const pagesPreview = Number.isNaN(endPage) ? 0 : Math.max(0, endPage - startPage);
  const minutesPreview = Number.parseInt(minutesRead, 10) || 0;

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
            icon={<BookOpen size={28} color={colors.accent} />}
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
          <BookPicker books={books} selectedId={bookId} onSelect={selectBook} />
          {errors.bookId ? <Text style={styles.error}>{errors.bookId}</Text> : null}
        </View>

        <NumberField
          label="Da página"
          value={fromPage}
          onChangeText={setFromPage}
          error={errors.fromPage}
          max={selectedBook?.totalPages}
        />

        <NumberField
          label="Até a página"
          hint={pagesPreview > 0 ? `${pagesPreview} páginas lidas` : undefined}
          value={toPage}
          onChangeText={setToPage}
          error={errors.toPage}
          placeholder={String(startPage)}
          baseValue={startPage}
          min={startPage}
          max={selectedBook?.totalPages}
          quickSteps={[10, 20, 50]}
          maxLabel="Fim do livro"
        />

        <NumberField
          label="Tempo de leitura"
          unit="min"
          value={minutesRead}
          onChangeText={setMinutesRead}
          error={errors.minutesRead}
          placeholder="0"
          step={5}
          quickSteps={[10, 20, 30]}
        />

        <NumberField
          label="Capítulo"
          hint={selectedBook ? `de ${selectedBook.chapters}` : undefined}
          value={chapter}
          onChangeText={setChapter}
          error={errors.chapter}
          min={1}
          max={selectedBook?.chapters}
        />

        {pagesPreview > 0 && minutesPreview > 0 ? (
          <View style={styles.summary}>
            <StatRow
              stats={[
                { label: 'Páginas', value: pagesPreview },
                { label: 'Ritmo', value: formatPace(minutesPreview, pagesPreview), unit: '/pág' },
                { label: 'Tempo', value: formatDuration(minutesPreview) },
              ]}
            />
          </View>
        ) : null}

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

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      gap: 22,
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
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    error: {
      color: colors.danger,
      fontSize: 12,
    },
    summary: {
      padding: 16,
      borderRadius: 14,
      backgroundColor: colors.accentSoft,
    },
    noteInput: {
      minHeight: 96,
      paddingTop: 14,
    },
    submit: {
      marginTop: 12,
    },
  });
