import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/app/action-button';
import { StatRow } from '@/components/app/stat-row';
import { ActivityCard } from '@/components/reading/activity-card';
import { BookCover } from '@/components/reading/book-cover';
import { ReadingColors } from '@/constants/theme';
import { useReadingStore } from '@/store/reading-store';
import { formatDuration, getBookProgress, getBookTotals } from '@/utils/reading';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const readerName = useReadingStore((state) => state.readerName);
  const books = useReadingStore((state) => state.books);
  const sessions = useReadingStore((state) => state.sessions);
  const finishBook = useReadingStore((state) => state.finishBook);
  const removeBook = useReadingStore((state) => state.removeBook);
  const book = books.find((item) => item.id === id);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Livro não encontrado</Text>
          <ActionButton label="Voltar para a biblioteca" onPress={() => router.replace('/(tabs)/library')} />
        </View>
      </SafeAreaView>
    );
  }

  const selectedBook = book;
  const totals = getBookTotals(selectedBook.id, sessions);
  const progress = getBookProgress(selectedBook);

  function confirmFinish() {
    Alert.alert('Finalizar livro', `Marcar "${selectedBook.title}" como finalizado?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Finalizar',
        onPress: () => finishBook(selectedBook.id),
      },
    ]);
  }

  function confirmRemove() {
    Alert.alert('Remover livro', `Remover "${selectedBook.title}" e todo o histórico dele?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          removeBook(selectedBook.id);
          router.replace('/(tabs)/library');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <BookCover book={selectedBook} size="large" />
          <View style={styles.heroCopy}>
            <Text style={styles.title}>{selectedBook.title}</Text>
            <Text style={styles.author}>{selectedBook.author}</Text>
            <Text style={styles.status}>
              {selectedBook.finishedAt ? 'Finalizado' : `Capítulo ${selectedBook.currentChapter} de ${selectedBook.chapters}`}
            </Text>
          </View>
        </View>

        <View style={styles.progressBlock}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {selectedBook.currentPage} de {selectedBook.totalPages} páginas · {progress}%
          </Text>
        </View>

        <StatRow
          stats={[
            { label: 'Páginas lidas', value: totals.pages },
            { label: 'Tempo', value: formatDuration(totals.minutes) },
            { label: 'Sessões', value: totals.sessions.length },
          ]}
        />

        <View style={styles.actions}>
          {!selectedBook.finishedAt ? (
            <ActionButton
              label="Registrar leitura"
              onPress={() => router.push({ pathname: '/log-reading', params: { bookId: selectedBook.id } })}
            />
          ) : null}
          <View style={styles.actionRow}>
            <ActionButton
              label="Editar"
              tone="secondary"
              style={styles.actionButton}
              onPress={() => router.push({ pathname: '/edit-book', params: { id: selectedBook.id } })}
            />
            {!selectedBook.finishedAt ? (
              <ActionButton label="Finalizar" tone="secondary" style={styles.actionButton} onPress={confirmFinish} />
            ) : null}
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {totals.sessions.length > 0 ? (
            totals.sessions.map((session) => (
              <ActivityCard key={session.id} book={selectedBook} readerName={readerName} session={session} />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma leitura registrada neste livro ainda.</Text>
          )}
        </View>

        <ActionButton label="Remover livro" tone="danger" onPress={confirmRemove} />
      </ScrollView>
    </SafeAreaView>
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
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  heroCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: ReadingColors.ink,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  author: {
    color: ReadingColors.text,
    fontSize: 15,
  },
  status: {
    marginTop: 4,
    color: ReadingColors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  progressBlock: {
    gap: 8,
  },
  progressTrack: {
    height: 6,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: ReadingColors.surface,
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: ReadingColors.accent,
  },
  progressText: {
    color: ReadingColors.muted,
    fontSize: 13,
  },
  actions: {
    gap: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  sectionTitle: {
    color: ReadingColors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    paddingVertical: 16,
    color: ReadingColors.muted,
    fontSize: 15,
  },
});
