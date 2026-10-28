import { ChevronRight, Palette as PaletteIcon } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/app/screen-header';
import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import { ThemeSheet } from '@/settings/components/theme-sheet';
import { THEME_OPTIONS } from '@/settings/utils/constants';
import { useReadingStore } from '@/store/reading-store';

export default function SettingsScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const preference = useReadingStore((state) => state.themePreference);
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const themeLabel = THEME_OPTIONS.find((option) => option.id === preference)?.label;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Ajustes" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => setIsThemeSheetOpen(true)}>
              <View style={styles.rowIcon}>
                <PaletteIcon size={18} color={colors.accent} />
              </View>
              <Text style={styles.rowLabel}>Tema</Text>
              <Text style={styles.rowValue}>{themeLabel}</Text>
              <ChevronRight size={18} color={colors.muted} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ThemeSheet visible={isThemeSheetOpen} onClose={() => setIsThemeSheetOpen(false)} />
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    container: {
      gap: 20,
      padding: 16,
      paddingBottom: 32,
    },
    section: {
      gap: 8,
    },
    sectionTitle: {
      marginLeft: 4,
      color: colors.muted,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    card: {
      borderRadius: 16,
      backgroundColor: colors.background,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    rowIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: colors.accentSoft,
    },
    rowLabel: {
      flex: 1,
      color: colors.ink,
      fontSize: 16,
      fontWeight: '500',
    },
    rowValue: {
      color: colors.muted,
      fontSize: 15,
    },
  });
