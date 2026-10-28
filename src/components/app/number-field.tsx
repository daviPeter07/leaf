import * as Haptics from 'expo-haptics';
import { Minus, Plus } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';

type NumberFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  hint?: string;
  unit?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  // Increment used by the − / + buttons.
  step?: number;
  // Shortcut chips that add to the current value, e.g. [10, 20] renders "+10" and "+20".
  quickSteps?: number[];
  // When set, renders a chip that jumps straight to `max` (e.g. "Fim do livro").
  maxLabel?: string;
  // Starting point for the buttons while the field is empty, e.g. the first page of the session.
  baseValue?: number;
  containerStyle?: StyleProp<ViewStyle>;
};

export function NumberField({
  label,
  value,
  onChangeText,
  error,
  hint,
  unit,
  placeholder,
  min = 0,
  max,
  step = 1,
  quickSteps,
  maxLabel,
  baseValue,
  containerStyle,
}: NumberFieldProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();

  const parsed = Number.parseInt(value, 10);
  const current = Number.isNaN(parsed) ? (baseValue ?? min) : parsed;

  function clamp(next: number) {
    return Math.max(min, max === undefined ? next : Math.min(max, next));
  }

  function change(next: number) {
    Haptics.selectionAsync();
    onChangeText(String(clamp(next)));
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>

      <View style={[styles.inputRow, error ? styles.inputRowError : undefined]}>
        <StepButton
          accessibilityLabel={`Diminuir ${label}`}
          disabled={current <= min}
          onPress={() => change(current - step)}>
          <Minus size={18} color={colors.ink} strokeWidth={2.5} />
        </StepButton>
        <View style={styles.valueBox}>
          <TextInput
            value={value}
            onChangeText={(text) => onChangeText(text.replace(/\D/g, ''))}
            keyboardType="number-pad"
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            selectTextOnFocus
            style={styles.input}
          />
          {unit ? <Text style={styles.unit}>{unit}</Text> : null}
        </View>
        <StepButton
          accessibilityLabel={`Aumentar ${label}`}
          disabled={max !== undefined && current >= max}
          onPress={() => change(current + step)}>
          <Plus size={18} color={colors.ink} strokeWidth={2.5} />
        </StepButton>
      </View>

      {quickSteps?.length || maxLabel ? (
        <View style={styles.chips}>
          {quickSteps?.map((amount) => (
            <TouchableOpacity key={amount} style={styles.chip} onPress={() => change(current + amount)}>
              <Text style={styles.chipText}>+{amount}</Text>
            </TouchableOpacity>
          ))}
          {maxLabel && max !== undefined ? (
            <TouchableOpacity style={[styles.chip, styles.chipAccent]} onPress={() => change(max)}>
              <Text style={[styles.chipText, styles.chipTextAccent]}>{maxLabel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

function StepButton({
  accessibilityLabel,
  children,
  disabled,
  onPress,
}: {
  accessibilityLabel: string;
  children: ReactNode;
  disabled: boolean;
  onPress: () => void;
}) {
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      hitSlop={6}
      style={[styles.stepButton, disabled ? styles.stepButtonDisabled : undefined]}>
      {children}
    </TouchableOpacity>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    wrapper: {
      gap: 8,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 8,
    },
    label: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    hint: {
      flexShrink: 1,
      color: colors.muted,
      fontSize: 12,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      padding: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.surface,
      backgroundColor: colors.surface,
    },
    inputRowError: {
      borderColor: colors.danger,
    },
    stepButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 42,
      height: 42,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    stepButtonDisabled: {
      opacity: 0.4,
    },
    valueBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 4,
    },
    input: {
      minWidth: 48,
      paddingVertical: 6,
      color: colors.ink,
      fontSize: 22,
      fontWeight: '700',
      fontVariant: ['tabular-nums'],
      textAlign: 'center',
    },
    unit: {
      color: colors.muted,
      fontSize: 14,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.line,
    },
    chipAccent: {
      borderColor: colors.accentSoft,
      backgroundColor: colors.accentSoft,
    },
    chipText: {
      color: colors.ink,
      fontSize: 14,
      fontWeight: '600',
    },
    chipTextAccent: {
      color: colors.accent,
    },
    error: {
      color: colors.danger,
      fontSize: 12,
    },
  });
