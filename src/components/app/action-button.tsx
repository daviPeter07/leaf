import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { ReadingColors } from '@/constants/theme';

type ActionButtonProps = {
  children?: ReactNode;
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  tone?: 'primary' | 'secondary' | 'danger';
};

export function ActionButton({ children, label, onPress, style, tone = 'primary' }: ActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, styles[tone], style]} onPress={onPress} activeOpacity={0.8}>
      {children}
      <Text style={[styles.label, tone === 'primary' ? styles.labelPrimary : undefined, tone === 'danger' ? styles.labelDanger : undefined]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: ReadingColors.accent,
  },
  secondary: {
    backgroundColor: ReadingColors.surface,
  },
  danger: {
    backgroundColor: 'transparent',
  },
  label: {
    color: ReadingColors.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  labelPrimary: {
    color: ReadingColors.white,
  },
  labelDanger: {
    color: ReadingColors.danger,
  },
});
