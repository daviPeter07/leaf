import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  accessory?: ReactNode;
};

export function ScreenHeader({ title, subtitle, accessory }: ScreenHeaderProps) {
  const styles = useThemedStyles(createStyles);

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

const createStyles = (colors: Palette) =>
  StyleSheet.create({
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
      color: colors.ink,
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.6,
    },
    subtitle: {
      color: colors.muted,
      fontSize: 15,
    },
  });
