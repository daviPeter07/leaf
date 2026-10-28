import { router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardAwareScrollView } from '@/components/app/keyboard-aware-scroll-view';
import { BookForm } from '@/books/components/book-form';
import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { useReadingStore } from '@/store/reading-store';
import type { AddBookInput } from '@/books/types';

export default function AddBookScreen() {
  const styles = useThemedStyles(createStyles);

  const addBook = useReadingStore((state) => state.addBook);

  function submit(data: AddBookInput) {
    addBook(data);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <BookForm submitLabel="Salvar livro" onSubmit={submit} />
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
      padding: 20,
    },
  });
