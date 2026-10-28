import { StyleSheet, Text, View } from 'react-native';

import { ReadingColors } from '@/constants/theme';
import type { TutorialSlide as TutorialSlideData } from '@/tutorial/types';

type TutorialSlideProps = {
  slide: TutorialSlideData;
  width: number;
};

export function TutorialSlide({ slide, width }: TutorialSlideProps) {
  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.iconCircle}>
        <slide.icon size={52} color={ReadingColors.accent} strokeWidth={2} />
      </View>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
