import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/app/action-button';
import { KeyboardAwareScrollView } from '@/components/app/keyboard-aware-scroll-view';
import { BookForm } from '@/components/reading/book-form';
import { ReadingColors } from '@/constants/theme';
import { useReadingStore } from '@/store/reading-store';
import type { AddBookInput } from '@/types/reading';

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = useReadingStore((state) => state.books.find((item) => item.id === id));
  const updateBook = useReadingStore((state) => state.updateBook);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Livro não encontrado</Text>
          <ActionButton label="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  function submit(data: AddBookInput) {
    updateBook({ id, ...data });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        <BookForm book={book} submitLabel="Salvar alterações" onSubmit={submit} />
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
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 20,
  },
  emptyTitle: {
    color: ReadingColors.ink,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
});
