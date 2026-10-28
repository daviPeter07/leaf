import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BookCover } from '@/books/components/book-cover';
import { BookForm } from '@/books/components/book-form';
import { BookSearch } from '@/books/components/book-search';
import type { AddBookInput, BookSearchResult } from '@/books/types';
import { KeyboardAwareScrollView } from '@/components/app/keyboard-aware-scroll-view';
import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import { useReadingStore } from '@/store/reading-store';

export default function AddBookScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const addBook = useReadingStore((state) => state.addBook);
  const [selected, setSelected] = useState<BookSearchResult | null>(null);

  function submit(data: AddBookInput) {
    addBook({ ...data, coverUrl: selected?.coverUrl });
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        {selected ? (
          <View style={styles.selected}>
            <BookCover book={{ coverUrl: selected.coverUrl }} />
            <View style={styles.selectedCopy}>
              <Text style={styles.selectedLabel}>Preenchido pela busca</Text>
              <Text style={styles.selectedTitle} numberOfLines={2}>{selected.title}</Text>
              <Text style={styles.selectedHint}>Confira os dados e informe os capítulos.</Text>
            </View>
            <TouchableOpacity onPress={() => setSelected(null)} hitSlop={10} accessibilityLabel="Desfazer seleção">
              <X size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.searchBlock}>
            <Text style={styles.sectionTitle}>Buscar livro</Text>
            <BookSearch onSelect={setSelected} />
          </View>
        )}

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{selected ? 'dados do livro' : 'ou preencha manualmente'}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Remount when a result is picked so the form starts from its values. */}
        <BookForm
          key={selected?.id ?? 'manual'}
          initialValues={selected ?? undefined}
          submitLabel="Salvar livro"
          onSubmit={submit}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      gap: 20,
      padding: 20,
    },
    searchBlock: {
      gap: 8,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '600',
    },
    selected: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 12,
      borderRadius: 14,
      backgroundColor: colors.accentSoft,
    },
    selectedCopy: {
      flex: 1,
      gap: 2,
    },
    selectedLabel: {
      color: colors.accent,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    selectedTitle: {
      color: colors.ink,
      fontSize: 16,
      fontWeight: '700',
    },
    selectedHint: {
      color: colors.text,
      fontSize: 13,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    dividerLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.line,
    },
    dividerText: {
      color: colors.muted,
      fontSize: 12,
    },
  });
