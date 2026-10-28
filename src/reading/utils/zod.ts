import { z } from 'zod';

export const readingSchema = z.object({
  bookId: z.string().min(1, 'Escolha um livro.'),
  fromPage: z.coerce.number().int().min(0, 'Informe a página inicial.'),
  toPage: z.coerce.number().int().min(1, 'Informe a página final.'),
  minutesRead: z.coerce.number().int().min(1, 'Informe o tempo de leitura.'),
  chapter: z.coerce.number().int().min(1, 'Informe o capítulo.'),
  note: z.string().trim().optional(),
}).refine((value) => value.toPage > value.fromPage, {
  path: ['toPage'],
  message: 'A página final precisa ser maior que a inicial.',
});

export type ReadingFormData = z.infer<typeof readingSchema>;
