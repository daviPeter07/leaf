import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { ReadingColors } from '@/constants/theme';

type FormFieldProps = TextInputProps & {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function FormField({ label, error, style, containerStyle, ...props }: FormFieldProps) {
  return (
    <View style={[styles.wrapper, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={ReadingColors.muted}
        style={[styles.input, error ? styles.inputError : undefined, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    color: ReadingColors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ReadingColors.surface,
    backgroundColor: ReadingColors.surface,
    color: ReadingColors.ink,
    fontSize: 16,
  },
  inputError: {
    borderColor: ReadingColors.danger,
  },
  error: {
    color: ReadingColors.danger,
    fontSize: 12,
  },
});
