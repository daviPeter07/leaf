import { router } from 'expo-router';
import { BookOpen, ChevronRight, Flame } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCard } from '@/books/components/book-card';
import { ActionButton } from '@/components/app/action-button';
import { EmptyState } from '@/components/app/empty-state';
import { ScreenHeader } from '@/components/app/screen-header';
import type { Palette } from '@/constants/theme';
import { useReadingData } from '@/hooks/use-reading-data';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import { ActivityCard } from '@/reading/components/activity-card';
import { WeekSummary } from '@/reading/components/week-summary';
import { formatLongDate, getStreak, getWeekSummary } from '@/reading/utils/functions';

export default function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
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
              <Flame size={16} color={colors.accent} strokeWidth={2.5} />
              <Text style={styles.streakText}>{streak}</Text>
            </View>
          }
        />

        {books.length === 0 ? (
          <View style={styles.card}>
            <EmptyState
              actionLabel="Adicionar livro"
              description="Cadastre o livro que você está lendo para começar a registrar suas leituras."
              icon={<BookOpen size={28} color={colors.accent} />}
              onAction={() => router.push('/add-book')}
              title="Sua estante está vazia"
            />
          </View>
        ) : (
          <>
            <WeekSummary summary={getWeekSummary(sessions)} />

            <View style={styles.card}>
              {activeBook ? (
                <>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Lendo agora</Text>
                    <TouchableOpacity
                      style={styles.link}
                      onPress={() => router.push({ pathname: '/book/[id]', params: { id: activeBook.id } })}>
                      <Text style={styles.linkText}>Ver livro</Text>
                      <ChevronRight size={16} color={colors.accent} />
                    </TouchableOpacity>
                  </View>
                  <BookCard book={activeBook} />
                  <ActionButton
                    label="Registrar leitura"
                    onPress={() => router.push({ pathname: '/log-reading', params: { bookId: activeBook.id } })}
                    style={styles.cardAction}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.cardTitle}>Nenhum livro em leitura</Text>
                  <ActionButton label="Começar um novo livro" onPress={() => router.push('/add-book')} style={styles.cardAction} />
                </>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Atividades</Text>
              {latestSessions.length > 0 ? (
                latestSessions.map((session, index) => (
                  <ActivityCard
                    key={session.id}
                    readerName={readerName}
                    session={session}
                    book={books.find((book) => book.id === session.bookId)}
                    divider={index < latestSessions.length - 1}
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
    streak: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.accentSoft,
    },
    streakText: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: '800',
    },
    card: {
      padding: 18,
      borderRadius: 16,
      backgroundColor: colors.background,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardTitle: {
      color: colors.ink,
      fontSize: 17,
      fontWeight: '700',
    },
    cardAction: {
      marginTop: 6,
    },
    link: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    linkText: {
      color: colors.accent,
      fontSize: 14,
      fontWeight: '600',
    },
    emptyText: {
      paddingTop: 12,
      color: colors.muted,
      fontSize: 15,
    },
  });
