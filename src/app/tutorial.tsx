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
import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { TutorialSlide } from '@/tutorial/components/tutorial-slide';
import { TUTORIAL_SLIDES } from '@/tutorial/utils/constants';
import { useReadingStore } from '@/store/reading-store';

export default function TutorialScreen() {
  const styles = useThemedStyles(createStyles);

  const { width } = useWindowDimensions();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [index, setIndex] = useState(0);
  const completeTutorial = useReadingStore((state) => state.completeTutorial);
  const isLast = index === TUTORIAL_SLIDES.length - 1;

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
        {TUTORIAL_SLIDES.map((slide) => (
          <TutorialSlide key={slide.title} slide={slide} width={width} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {TUTORIAL_SLIDES.map((slide, slideIndex) => (
            <View key={slide.title} style={[styles.dot, slideIndex === index ? styles.dotActive : undefined]} />
          ))}
        </View>
        <ActionButton label={isLast ? 'Começar' : 'Próximo'} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topBar: {
      alignItems: 'flex-end',
      height: 44,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    skip: {
      color: colors.muted,
      fontSize: 15,
      fontWeight: '600',
    },
    pager: {
      flex: 1,
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
      backgroundColor: colors.line,
    },
    dotActive: {
      width: 22,
      backgroundColor: colors.accent,
    },
  });
