import { BookOpen, CalendarCheck, ChartColumn, PenLine, Share2 } from 'lucide-react-native';
import { type ComponentRef, useRef, useState } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/app/action-button';
import { ReadingColors } from '@/constants/theme';
import { useReadingStore } from '@/store/reading-store';

const SLIDES = [
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

export default function TutorialScreen() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [index, setIndex] = useState(0);
  const completeTutorial = useReadingStore((state) => state.completeTutorial);
  const isLast = index === SLIDES.length - 1;

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  }

  function next() {
    if (isLast) {
      completeTutorial();
      return;
    }

    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
    setIndex(index + 1);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        {!isLast ? (
          <TouchableOpacity onPress={completeTutorial} hitSlop={12}>
            <Text style={styles.skip}>Pular</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        style={styles.pager}>
        {SLIDES.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <slide.icon size={52} color={ReadingColors.accent} strokeWidth={2} />
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, slideIndex) => (
            <View key={slide.title} style={[styles.dot, slideIndex === index ? styles.dotActive : undefined]} />
          ))}
        </View>
        <ActionButton label={isLast ? 'Começar' : 'Próximo'} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: ReadingColors.background,
  },
  topBar: {
    alignItems: 'flex-end',
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  skip: {
    color: ReadingColors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  pager: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 36,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 128,
    marginBottom: 20,
    borderRadius: 999,
    backgroundColor: ReadingColors.accentSoft,
  },
  title: {
    color: ReadingColors.ink,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  description: {
    color: ReadingColors.text,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  footer: {
    gap: 24,
    padding: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: ReadingColors.line,
  },
  dotActive: {
    width: 22,
    backgroundColor: ReadingColors.accent,
  },
});
