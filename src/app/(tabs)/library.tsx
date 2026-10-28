import { router } from 'expo-router';
import { BookOpen, Plus } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/app/empty-state';
import { ScreenHeader } from '@/components/app/screen-header';
import { BookCard } from '@/books/components/book-card';
import { ReadingColors } from '@/constants/theme';
import { useReadingData } from '@/hooks/use-reading-data';
import type { Book } from '@/books/types';

export default function LibraryScreen() {
  const { books } = useReadingData();
  const reading = books.filter((book) => !book.finishedAt);
  const finished = books.filter((book) => book.finishedAt);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Biblioteca"
          subtitle={books.length > 0 ? `${reading.length} lendo · ${finished.length} lidos` : undefined}
          accessory={
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-book')} accessibilityLabel="Adicionar livro">
              <Plus size={22} color={ReadingColors.white} strokeWidth={2.5} />
            </TouchableOpacity>
          }
        />

        {books.length === 0 ? (
          <EmptyState
            actionLabel="Adicionar livro"
            description="Cada livro guarda o progresso e o histórico das suas leituras."
            icon={<BookOpen size={28} color={ReadingColors.accent} />}
            onAction={() => router.push('/add-book')}
            title="Nenhum livro ainda"
          />
        ) : (
          <>
            <BookSection title="Lendo" books={reading} />
            <BookSection title="Finalizados" books={finished} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function BookSection({ title, books }: { title: string; books: Book[] }) {
  if (books.length === 0) {
    return null;
  }

  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {books.map((book) => (
        <BookCard key={book.id} book={book} onPress={() => router.push({ pathname: '/book/[id]', params: { id: book.id } })} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ReadingColors.background,
  },
  container: {
    gap: 24,
    padding: 20,
    paddingBottom: 32,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: ReadingColors.accent,
  },
  sectionTitle: {
    marginBottom: 4,
    color: ReadingColors.muted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
});
