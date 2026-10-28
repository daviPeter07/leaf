import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type Stat = {
  label: string;
  value: string | number;
  unit?: string;
};

type StatRowProps = {
  stats: Stat[];
  size?: 'regular' | 'large';
};

export function StatRow({ stats, size = 'regular' }: StatRowProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      {stats.map((stat, index) => (
        <Fragment key={stat.label}>
          {index > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.item}>
            <Text style={styles.label}>{stat.label}</Text>
            <Text style={[styles.value, size === 'large' ? styles.valueLarge : undefined]} numberOfLines={1}>
              {stat.value}
              {stat.unit ? <Text style={styles.unit}> {stat.unit}</Text> : null}
            </Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    divider: {
      width: StyleSheet.hairlineWidth,
      marginHorizontal: 14,
      backgroundColor: colors.line,
    },
    item: {
      flex: 1,
      gap: 2,
    },
    label: {
      color: colors.muted,
      fontSize: 12,
    },
    value: {
      color: colors.ink,
      fontSize: 18,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
    },
    valueLarge: {
      fontSize: 24,
    },
    unit: {
      color: colors.muted,
      fontSize: 13,
      fontWeight: '500',
    },
  });
