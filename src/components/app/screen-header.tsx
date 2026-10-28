import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ReadingColors } from '@/constants/theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  accessory?: ReactNode;
};

export function ScreenHeader({ title, subtitle, accessory }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {accessory}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: ReadingColors.ink,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: ReadingColors.muted,
    fontSize: 15,
  },
});
