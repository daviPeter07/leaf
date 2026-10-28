import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ActionButton } from '@/components/app/action-button';
import { FormField } from '@/components/app/form-field';
import type { AddBookInput, Book } from '@/books/types';
import { bookSchema, type BookFormData } from '@/books/utils/zod';

type FormErrors = Partial<Record<keyof BookFormData, string>>;

type BookFormProps = {
  book?: Book;
  onSubmit: (data: AddBookInput) => void;
  submitLabel: string;
};

export function BookForm({ book, onSubmit, submitLabel }: BookFormProps) {
  const [title, setTitle] = useState(book?.title ?? '');
  const [author, setAuthor] = useState(book?.author ?? '');
  const [totalPages, setTotalPages] = useState(book?.totalPages.toString() ?? '');
  const [chapters, setChapters] = useState(book?.chapters.toString() ?? '');
  const [currentPage, setCurrentPage] = useState(book?.currentPage.toString() ?? '0');
  const [errors, setErrors] = useState<FormErrors>({});

  function submit() {
    const result = bookSchema.safeParse({ title, author, totalPages, chapters, currentPage });

    if (!result.success) {
      setErrors(Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message])) as FormErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.formCard}>
        <FormField
          label="Título"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
          placeholder="Ex: Dom Casmurro"
        />
        <FormField
          label="Autora ou autor"
          value={author}
          onChangeText={setAuthor}
          error={errors.author}
          placeholder="Ex: Machado de Assis"
        />
        <View style={styles.row}>
          <FormField
            label="Páginas"
            value={totalPages}
            onChangeText={setTotalPages}
            keyboardType="number-pad"
            error={errors.totalPages}
            containerStyle={styles.rowInput}
            placeholder="Ex: 256"
          />
          <FormField
            label="Capítulos"
            value={chapters}
            onChangeText={setChapters}
            keyboardType="number-pad"
            error={errors.chapters}
            containerStyle={styles.rowInput}
            placeholder="Ex: 148"
          />
        </View>
        <FormField
          label="Página atual"
          value={currentPage}
          onChangeText={setCurrentPage}
          keyboardType="number-pad"
          error={errors.currentPage}
          placeholder="0 se ainda não começou"
        />
      </View>
      <ActionButton label={submitLabel} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 28,
  },
  formCard: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowInput: {
    flex: 1,
  },
});
