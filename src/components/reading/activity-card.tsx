import { StyleSheet, Text, View } from 'react-native';

import { StatRow } from '@/components/app/stat-row';
import { ReadingColors } from '@/constants/theme';
import type { Book, ReadingSession } from '@/types/reading';
import { formatDuration, formatPace, formatSessionTime } from '@/utils/reading';

type ActivityCardProps = {
  book?: Book;
  readerName: string;
  session: ReadingSession;
};

export function ActivityCard({ book, readerName, session }: ActivityCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{readerName.charAt(0)}</Text>
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.reader}>{readerName}</Text>
          <Text style={styles.time}>
            {formatSessionTime(session.date)} · cap. {session.chapter}
          </Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>{book?.title ?? 'Livro removido'}</Text>
      <StatRow
        stats={[
          { label: 'Páginas', value: session.pagesRead },
          { label: 'Ritmo', value: formatPace(session.minutesRead, session.pagesRead), unit: '/pág' },
          { label: 'Tempo', value: formatDuration(session.minutesRead) },
        ]}
      />
      {session.note ? <Text style={styles.note}>{session.note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ReadingColors.line,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: ReadingColors.accentSoft,
  },
  avatarText: {
    color: ReadingColors.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  headerCopy: {
    flex: 1,
  },
  reader: {
    color: ReadingColors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  time: {
    color: ReadingColors.muted,
    fontSize: 12,
  },
  title: {
    color: ReadingColors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  note: {
    color: ReadingColors.text,
    fontSize: 14,
    lineHeight: 20,
  },
});
