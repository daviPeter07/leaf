import { StyleSheet, Text, View } from 'react-native';

import type { Palette } from '@/constants/theme';
import { useColors, useThemedStyles } from '@/hooks/use-theme';
import type { TutorialSlide as TutorialSlideData } from '@/tutorial/types';

type TutorialSlideProps = {
  slide: TutorialSlideData;
  width: number;
};

export function TutorialSlide({ slide, width }: TutorialSlideProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();

  return (
    <View style={[styles.slide, { width }]}>
      <View style={styles.iconCircle}>
        <slide.icon size={52} color={colors.accent} strokeWidth={2} />
      </View>
      <Text style={styles.title}>{slide.title}</Text>
      <Text style={styles.description}>{slide.description}</Text>
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
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
      backgroundColor: colors.accentSoft,
    },
    title: {
      color: colors.ink,
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: -0.5,
      textAlign: 'center',
    },
    description: {
      color: colors.text,
      fontSize: 16,
      lineHeight: 23,
      textAlign: 'center',
    },
  });
