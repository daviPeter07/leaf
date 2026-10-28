import { StyleSheet, Text, View } from 'react-native';

import { StatRow } from '@/components/app/stat-row';
import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import type { Book } from '@/books/types';
import type { ReadingSession } from '@/reading/types';
import { formatDuration, formatPace, formatSessionTime } from '@/reading/utils/functions';

type ActivityCardProps = {
  book?: Book;
  readerName: string;
  session: ReadingSession;
  divider?: boolean;
};

export function ActivityCard({ book, readerName, session, divider = true }: ActivityCardProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.card, divider ? styles.divider : undefined]}>
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

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    card: {
      gap: 12,
      paddingVertical: 18,
    },
    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.line,
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
      backgroundColor: colors.accentSoft,
    },
    avatarText: {
      color: colors.accent,
      fontSize: 15,
      fontWeight: '800',
    },
    headerCopy: {
      flex: 1,
    },
    reader: {
      color: colors.ink,
      fontSize: 14,
      fontWeight: '700',
    },
    time: {
      color: colors.muted,
      fontSize: 12,
    },
    title: {
      color: colors.ink,
      fontSize: 18,
      fontWeight: '700',
    },
    note: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
    },
  });
