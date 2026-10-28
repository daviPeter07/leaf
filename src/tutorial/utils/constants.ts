import { BookOpen, CalendarCheck, ChartColumn, PenLine, Share2 } from 'lucide-react-native';

import type { TutorialSlide } from '@/tutorial/types';

export const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    icon: BookOpen,
    title: 'Oi, Alice!',
    description: 'O Leaf acompanha suas leituras como um treino: páginas, tempo e ritmo de cada dia.',
  },
  {
    icon: CalendarCheck,
    title: 'Monte sua estante',
    description: 'Na Biblioteca, adicione o livro que você está lendo com o total de páginas e capítulos.',
  },
  {
    icon: PenLine,
    title: 'Registre cada leitura',
    description: 'Terminou de ler? Toque em "Registrar leitura" e informe de qual página até qual página você foi.',
  },
  {
    icon: ChartColumn,
    title: 'Veja sua semana',
    description: 'No Início, acompanhe as páginas da semana, os dias lidos e a sua sequência.',
  },
  {
    icon: Share2,
    title: 'Compartilhe seus dias',
    description: 'Em Status, escolha um dia de leitura e compartilhe a imagem nos stories, com ou sem foto.',
  },
];
