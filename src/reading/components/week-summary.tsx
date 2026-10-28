import { StyleSheet, Text, View } from 'react-native';

import { StatRow } from '@/components/app/stat-row';
import { ReadingColors } from '@/constants/theme';
import { formatDuration, getWeekSummary } from '@/reading/utils/functions';

type WeekSummaryProps = {
  summary: ReturnType<typeof getWeekSummary>;
};

export function WeekSummary({ summary }: WeekSummaryProps) {
  const maxPages = Math.max(1, ...summary.days.map((day) => day.pages));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Esta semana</Text>
      <StatRow
        size="large"
        stats={[
          { label: 'Páginas', value: summary.pages },
          { label: 'Tempo', value: formatDuration(summary.minutes) },
          { label: 'Dias', value: summary.daysRead, unit: '/7' },
        ]}
      />
      <View style={styles.chart}>
        {summary.days.map((day) => (
          <View key={day.key} style={styles.column}>
            <View style={styles.barArea}>
              <View
                style={[
                  styles.bar,
                  day.pages > 0
                    ? { height: `${Math.max(12, (day.pages / maxPages) * 100)}%`, backgroundColor: ReadingColors.accent }
                    : styles.barEmpty,
                ]}
              />
            </View>
            <Text style={[styles.dayLabel, day.isToday ? styles.dayLabelToday : undefined]}>{day.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    padding: 18,
    borderRadius: 16,
    backgroundColor: ReadingColors.surface,
  },
  title: {
    color: ReadingColors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  chart: {
    flexDirection: 'row',
    gap: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barArea: {
    width: '100%',
    height: 56,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
  },
  barEmpty: {
    height: 4,
    backgroundColor: ReadingColors.line,
  },
  dayLabel: {
    color: ReadingColors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  dayLabelToday: {
    color: ReadingColors.accent,
    fontWeight: '800',
  },
});
