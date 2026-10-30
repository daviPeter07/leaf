import * as Haptics from 'expo-haptics';
import { Check } from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomSheet } from '@/components/app/bottom-sheet';
import { ACCENT_COLORS, type Palette } from '@/constants/theme';
import { useColors, useIsDark, useThemedStyles } from '@/hooks/use-theme';
import { ACCENT_OPTIONS } from '@/settings/utils/constants';
import { useReadingStore } from '@/store/reading-store';

type AccentSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function AccentSheet({ visible, onClose }: AccentSheetProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const isDark = useIsDark();
  const accentColor = useReadingStore((state) => state.accentColor);
  const setAccentColor = useReadingStore((state) => state.setAccentColor);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Cor principal"
      description="Escolha a cor que aparece em botões, ícones e destaques do Leaf.">
      <View style={styles.grid}>
        {ACCENT_OPTIONS.map((id) => {
          const option = ACCENT_COLORS[id];
          const swatch = isDark ? option.dark.accent : option.light.accent;
          const isSelected = id === accentColor;

          return (
            <TouchableOpacity
              key={id}
              style={[styles.option, isSelected ? styles.optionSelected : undefined]}
              onPress={() => {
                Haptics.selectionAsync();
                setAccentColor(id);
              }}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isSelected }}>
              <View style={[styles.swatch, { backgroundColor: swatch }]}>
                {isSelected ? <Check size={20} color={colors.white} strokeWidth={3} /> : null}
              </View>
              <Text style={[styles.label, isSelected ? styles.labelSelected : undefined]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    option: {
      alignItems: 'center',
      gap: 8,
      width: '22%',
      flexGrow: 1,
      paddingVertical: 12,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.line,
    },
    optionSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accentSoft,
    },
    swatch: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      borderRadius: 999,
    },
    label: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '500',
    },
    labelSelected: {
      color: colors.ink,
      fontWeight: '700',
    },
  });
