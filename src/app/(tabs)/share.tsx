import { router } from 'expo-router';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/app/empty-state';
import { ScreenHeader } from '@/components/app/screen-header';
import { ReadingColors } from '@/constants/theme';
import { useReadingData } from '@/hooks/use-reading-data';
import { formatDayLabel, formatDuration, getReadingDays } from '@/utils/reading';

export default function ShareScreen() {
  const { books, sessions } = useReadingData();
  const readingDays = getReadingDays(sessions);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Status" subtitle="Escolha um dia de leitura para compartilhar." />

        {readingDays.length === 0 ? (
          <EmptyState
            actionLabel={books.length > 0 ? 'Registrar leitura' : 'Adicionar livro'}
            description="Cada dia em que você registrar uma leitura aparece aqui, pronto para virar story."
            icon={<BookOpen size={28} color={ReadingColors.accent} />}
            onAction={() => router.push(books.length > 0 ? '/log-reading' : '/add-book')}
            title="Nenhum dia de leitura ainda"
          />
        ) : (
          <View>
            {readingDays.map((day) => {
              const titles = [...new Set(day.sessions.map((session) => books.find((book) => book.id === session.bookId)?.title))]
                .filter(Boolean)
                .join(', ');

              return (
                <TouchableOpacity
                  key={day.key}
                  style={styles.dayRow}
                  activeOpacity={0.7}
                  onPress={() => router.push({ pathname: '/share-day', params: { date: day.key } })}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateDay}>{day.key.slice(8, 10)}</Text>
                  </View>
                  <View style={styles.dayCopy}>
                    <Text style={styles.dayTitle}>{formatDayLabel(day.key)}</Text>
                    <Text style={styles.dayMeta} numberOfLines={1}>
                      {day.pages} págs. · {formatDuration(day.minutes)}
                      {titles ? ` · ${titles}` : ''}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={ReadingColors.muted} />
                </TouchableOpacity>
              );
            })}
          </View>
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
    gap: 20,
    padding: 20,
    paddingBottom: 32,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ReadingColors.line,
  },
  dateBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: ReadingColors.accentSoft,
  },
  dateDay: {
    color: ReadingColors.accent,
    fontSize: 18,
    fontWeight: '800',
  },
  dayCopy: {
    flex: 1,
    gap: 2,
  },
  dayTitle: {
    color: ReadingColors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  dayMeta: {
    color: ReadingColors.muted,
    fontSize: 13,
  },
});
