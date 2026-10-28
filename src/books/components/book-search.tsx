import { Search, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { BookCover } from '@/books/components/book-cover';
import type { BookSearchResult } from '@/books/types';
import { BOOK_SEARCH_DEBOUNCE_MS, BOOK_SEARCH_MIN_LENGTH } from '@/books/utils/constants';
import { searchBooks } from '@/books/utils/functions';
import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';

type BookSearchProps = {
  onSelect: (result: BookSearchResult) => void;
};

type SearchState =
  | { status: 'done'; query: string; results: BookSearchResult[] }
  | { status: 'error'; query: string };

export function BookSearch({ onSelect }: BookSearchProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState<SearchState | null>(null);
  const trimmed = query.trim();
  const isSearchable = trimmed.length >= BOOK_SEARCH_MIN_LENGTH;
  // Only show an answer for the text currently typed; anything else is still loading.
  const current = isSearchable && search?.query === trimmed ? search : null;
  const isLoading = isSearchable && !current;

  useEffect(() => {
    if (trimmed.length < BOOK_SEARCH_MIN_LENGTH) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      searchBooks(trimmed, controller.signal)
        .then((results) => setSearch({ status: 'done', query: trimmed, results }))
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            console.warn('Book search failed', error);
            setSearch({ status: 'error', query: trimmed });
          }
        });
    }, BOOK_SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [trimmed]);

  function select(result: BookSearchResult) {
    onSelect(result);
    setQuery('');
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Search size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar por título ou autor"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          autoCorrect={false}
          style={styles.input}
        />
        {isLoading ? <ActivityIndicator size="small" color={colors.accent} /> : null}
        {query && !isLoading ? (
          <TouchableOpacity onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Limpar busca">
            <X size={18} color={colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {current?.status === 'error' ? (
        <Text style={styles.message}>Não foi possível buscar agora. Confira a internet ou preencha manualmente.</Text>
      ) : null}

      {current?.status === 'done' && current.results.length === 0 ? (
        <Text style={styles.message}>Nenhum livro encontrado. Tente outro termo ou preencha manualmente.</Text>
      ) : null}

      {current?.status === 'done' && current.results.length > 0 ? (
        <View style={styles.results}>
          {current.results.map((result, index) => (
            <TouchableOpacity
              key={result.id}
              style={[styles.result, index > 0 ? styles.resultDivider : undefined]}
              onPress={() => select(result)}>
              <BookCover book={{ coverUrl: result.coverUrl }} />
              <View style={styles.resultCopy}>
                <Text style={styles.resultTitle} numberOfLines={2}>{result.title}</Text>
                {result.author ? <Text style={styles.resultMeta} numberOfLines={1}>{result.author}</Text> : null}
                <Text style={styles.resultMeta}>
                  {result.totalPages ? `${result.totalPages} páginas` : 'Páginas não informadas'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text style={styles.attribution}>Dados do Open Library</Text>
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      minHeight: 50,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.surface,
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      color: colors.ink,
      fontSize: 16,
    },
    message: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
    },
    results: {
      borderRadius: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.line,
      overflow: 'hidden',
    },
    result: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 12,
    },
    resultDivider: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.line,
    },
    resultCopy: {
      flex: 1,
      gap: 2,
    },
    resultTitle: {
      color: colors.ink,
      fontSize: 15,
      fontWeight: '700',
    },
    resultMeta: {
      color: colors.muted,
      fontSize: 13,
    },
    attribution: {
      paddingVertical: 8,
      color: colors.muted,
      fontSize: 11,
      textAlign: 'center',
    },
  });
