import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().trim().min(1, 'Informe o título.'),
  author: z.string().trim().min(1, 'Informe a autora ou autor.'),
  totalPages: z.coerce.number().int().min(1, 'Informe o total de páginas.'),
  chapters: z.coerce.number().int().min(1, 'Informe a quantidade de capítulos.'),
  currentPage: z.coerce.number().int().min(0, 'Página atual inválida.'),
}).refine((value) => value.currentPage <= value.totalPages, {
  path: ['currentPage'],
  message: 'A página atual não pode passar do total.',
});

export type BookFormData = z.infer<typeof bookSchema>;
