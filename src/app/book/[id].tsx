import { router, Stack, useLocalSearchParams } from 'expo-router';
import { CircleCheck, Pencil, Trash2 } from 'lucide-react-native';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/app/action-button';
import { StatRow } from '@/components/app/stat-row';
import { ActivityCard } from '@/reading/components/activity-card';
import { BookCover } from '@/books/components/book-cover';
import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import { useReadingStore } from '@/store/reading-store';
import { getBookProgress, getBookTotals } from '@/books/utils/functions';
import { formatDuration } from '@/reading/utils/functions';

export default function BookDetailScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();

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
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/edit-book', params: { id: selectedBook.id } })}
              hitSlop={10}
              accessibilityLabel="Editar livro">
              <Pencil size={20} color={colors.ink} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
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

          {!selectedBook.finishedAt ? (
            <ActionButton
              label="Registrar leitura"
              onPress={() => router.push({ pathname: '/log-reading', params: { bookId: selectedBook.id } })}
            />
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo</Text>
          <StatRow
            stats={[
              { label: 'Páginas lidas', value: totals.pages },
              { label: 'Tempo', value: formatDuration(totals.minutes) },
              { label: 'Sessões', value: totals.sessions.length },
            ]}
          />
        </View>

        <View style={[styles.card, styles.listCard]}>
          <Text style={styles.cardTitle}>Histórico</Text>
          {totals.sessions.length > 0 ? (
            totals.sessions.map((session, index) => (
              <ActivityCard
                key={session.id}
                book={selectedBook}
                readerName={readerName}
                session={session}
                divider={index < totals.sessions.length - 1}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma leitura registrada neste livro ainda.</Text>
          )}
        </View>

        <View style={[styles.card, styles.menuCard]}>
          {!selectedBook.finishedAt ? (
            <TouchableOpacity style={styles.menuItem} onPress={confirmFinish}>
              <CircleCheck size={20} color={colors.ink} />
              <Text style={styles.menuText}>Marcar como finalizado</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={[styles.menuItem, !selectedBook.finishedAt ? styles.menuItemDivider : undefined]} onPress={confirmRemove}>
            <Trash2 size={20} color={colors.danger} />
            <Text style={[styles.menuText, styles.menuTextDanger]}>Remover livro</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    container: {
      gap: 14,
      padding: 16,
      paddingBottom: 32,
    },
    card: {
      gap: 16,
      padding: 18,
      borderRadius: 16,
      backgroundColor: colors.background,
    },
    listCard: {
      gap: 0,
      paddingBottom: 4,
    },
    menuCard: {
      gap: 0,
      padding: 0,
      overflow: 'hidden',
    },
    cardTitle: {
      color: colors.ink,
      fontSize: 17,
      fontWeight: '700',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      gap: 20,
      padding: 20,
    },
    emptyTitle: {
      color: colors.ink,
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
      color: colors.ink,
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: -0.4,
    },
    author: {
      color: colors.text,
      fontSize: 15,
    },
    status: {
      marginTop: 4,
      color: colors.accent,
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
      backgroundColor: colors.surface,
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: colors.accent,
    },
    progressText: {
      color: colors.muted,
      fontSize: 13,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 18,
      paddingVertical: 16,
    },
    menuItemDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.line,
    },
    menuText: {
      color: colors.ink,
      fontSize: 15,
      fontWeight: '500',
    },
    menuTextDanger: {
      color: colors.danger,
    },
    emptyText: {
      paddingTop: 12,
      paddingBottom: 14,
      color: colors.muted,
      fontSize: 15,
    },
  });
