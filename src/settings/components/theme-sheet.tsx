import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomSheet } from '@/components/app/bottom-sheet';
import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import { THEME_OPTIONS } from '@/settings/utils/constants';
import { useReadingStore } from '@/store/reading-store';

type ThemeSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function ThemeSheet({ visible, onClose }: ThemeSheetProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const preference = useReadingStore((state) => state.themePreference);
  const setThemePreference = useReadingStore((state) => state.setThemePreference);

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Tema" description="Escolha a aparência do Leaf.">
      <View style={styles.options}>
        {THEME_OPTIONS.map((option) => {
          const isSelected = option.id === preference;

          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, isSelected ? styles.optionSelected : undefined]}
              onPress={() => {
                Haptics.selectionAsync();
                setThemePreference(option.id);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}>
              <View style={[styles.iconWrap, isSelected ? styles.iconWrapSelected : undefined]}>
                <option.icon size={20} color={isSelected ? colors.white : colors.ink} />
              </View>
              <View style={styles.copy}>
                <Text style={styles.label}>{option.label}</Text>
                <Text style={styles.description}>{option.description}</Text>
              </View>
              {isSelected ? <Check size={20} color={colors.accent} strokeWidth={2.5} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    options: {
      gap: 10,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.line,
    },
    optionSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    iconWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: 999,
      backgroundColor: colors.surface,
    },
    iconWrapSelected: {
      backgroundColor: colors.accent,
    },
    copy: {
      flex: 1,
      gap: 2,
    },
    label: {
      color: colors.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    description: {
      color: colors.muted,
      fontSize: 13,
    },
  });
