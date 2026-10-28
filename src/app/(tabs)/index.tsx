import { router } from 'expo-router';
import { BookOpen, Flame } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/app/action-button';
import { EmptyState } from '@/components/app/empty-state';
import { ScreenHeader } from '@/components/app/screen-header';
import { ActivityCard } from '@/components/reading/activity-card';
import { BookCard } from '@/components/reading/book-card';
import { WeekSummary } from '@/components/reading/week-summary';
import { ReadingColors } from '@/constants/theme';
import { useReadingData } from '@/hooks/use-reading-data';
import { formatLongDate, getStreak, getWeekSummary } from '@/utils/reading';

export default function HomeScreen() {
  const { activeBook, books, readerName, sessions } = useReadingData();
  const streak = getStreak(sessions);
  const latestSessions = sessions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title={`Olá, ${readerName}`}
          subtitle={formatLongDate(new Date())}
          accessory={
            <View style={styles.streak}>
              <Flame size={16} color={ReadingColors.accent} strokeWidth={2.5} />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          }
        />

        {books.length === 0 ? (
          <EmptyState
            actionLabel="Adicionar livro"
            description="Cadastre o livro que você está lendo para começar a registrar suas leituras."
            icon={<BookOpen size={28} color={ReadingColors.accent} />}
            onAction={() => router.push('/add-book')}
            title="Sua estante está vazia"
          />
        ) : (
          <>
            <WeekSummary summary={getWeekSummary(sessions)} />

            {activeBook ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lendo agora</Text>
                <BookCard
                  book={activeBook}
                  onPress={() => router.push({ pathname: '/book/[id]', params: { id: activeBook.id } })}
                />
                <ActionButton
                  label="Registrar leitura"
                  onPress={() => router.push({ pathname: '/log-reading', params: { bookId: activeBook.id } })}
                />
              </View>
            ) : (
              <ActionButton label="Começar um novo livro" onPress={() => router.push('/add-book')} />
            )}

            <View>
              <Text style={styles.sectionTitle}>Atividades</Text>
              {latestSessions.length > 0 ? (
                latestSessions.map((session) => (
                  <ActivityCard
                    key={session.id}
                    readerName={readerName}
                    session={session}
                    book={books.find((book) => book.id === session.bookId)}
                  />
                ))
              ) : (
                <Text style={styles.emptyText}>Suas leituras registradas vão aparecer aqui.</Text>
              )}
            </View>
          </>
        )}
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
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: ReadingColors.accentSoft,
  },
  streakText: {
    color: ReadingColors.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  section: {
    gap: 4,
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
