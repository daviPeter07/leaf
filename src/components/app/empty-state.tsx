import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/app/action-button';
import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type EmptyStateProps = {
  actionLabel?: string;
  description: string;
  icon?: ReactNode;
  onAction?: () => void;
  title: string;
};

export function EmptyState({ actionLabel, description, icon, onAction, title }: EmptyStateProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? <ActionButton label={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 36,
      paddingHorizontal: 24,
    },
    iconWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 64,
      height: 64,
      marginBottom: 8,
      borderRadius: 999,
      backgroundColor: colors.accentSoft,
    },
    title: {
      color: colors.ink,
      fontSize: 19,
      fontWeight: '700',
      textAlign: 'center',
    },
    description: {
      color: colors.muted,
      fontSize: 15,
      lineHeight: 21,
      textAlign: 'center',
    },
    action: {
      alignSelf: 'stretch',
      marginTop: 12,
    },
  });
