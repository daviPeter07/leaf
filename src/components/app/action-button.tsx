import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type ActionButtonProps = {
  children?: ReactNode;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'primary' | 'secondary' | 'danger';
};

export function ActionButton({ children, label, onPress, style, tone = 'primary' }: ActionButtonProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity style={[styles.button, styles[tone], style]} onPress={onPress} activeOpacity={0.8}>
      {children}
      <Text style={[styles.label, tone === 'primary' ? styles.labelPrimary : undefined, tone === 'danger' ? styles.labelDanger : undefined]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 15,
      paddingHorizontal: 18,
      borderRadius: 999,
    },
    primary: {
      backgroundColor: colors.accent,
    },
    secondary: {
      backgroundColor: colors.surface,
    },
    danger: {
      backgroundColor: 'transparent',
    },
    label: {
      color: colors.ink,
      fontSize: 15,
      fontWeight: '700',
    },
    labelPrimary: {
      color: colors.white,
    },
    labelDanger: {
      color: colors.danger,
    },
  });
