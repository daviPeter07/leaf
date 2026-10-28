import { BookOpen, ChartColumn, PenLine, Search, Settings, Share2 } from 'lucide-react-native';

import type { TutorialSlide } from '@/tutorial/types';

// Keep these in sync with the app: each card describes a real screen and the names of its buttons.
export const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    icon: BookOpen,
    title: 'Oi, Alice!',
    description: 'O Leaf acompanha suas leituras como um treino: páginas, tempo e ritmo de cada dia.',
  },
  {
    icon: Search,
    title: 'Monte sua estante',
    description:
      'Em Biblioteca, toque em Adicionar e busque pelo título e pelo autor. Capa, autor e páginas vêm preenchidos; você só informa os capítulos.',
  },
  {
    icon: PenLine,
    title: 'Registre cada leitura',
    description:
      'No Início, toque em Registrar leitura. Os atalhos +10, +20 e Fim do livro preenchem as páginas e o tempo num toque.',
  },
  {
    icon: ChartColumn,
    title: 'Veja sua semana',
    description: 'O Início mostra as páginas e o tempo da semana, os dias lidos e a sua sequência de dias seguidos.',
  },
  {
    icon: Share2,
    title: 'Compartilhe seus dias',
    description: 'Em Status, escolha um dia de leitura e gere a imagem para os stories, com foto ou como sticker transparente.',
  },
  {
    icon: Settings,
    title: 'Deixe do seu jeito',
    description: 'Em Ajustes, escolha o tema claro, o escuro ou o mesmo do celular.',
  },
];
