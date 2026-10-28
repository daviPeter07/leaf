import { BookOpen } from 'lucide-react-native';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ReadingColors } from '@/constants/theme';
import type { ReadingDay } from '@/reading/types';
import { formatDuration, formatPace } from '@/reading/utils/functions';
import type { StickerTemplate } from '@/share/types';

type ShareStickerProps = {
  day: ReadingDay;
  template: StickerTemplate;
  photoUri?: string | null;
  width: number;
};

// Story-sized (9:16) overlay with the day's metrics stacked in the centre, Strava style.
// Only the "photo" template paints a background; "sticker" exports transparent. Labels and the book icon are orange, values are white.
export function ShareSticker({ day, template, photoUri, width }: ShareStickerProps) {
  const scale = width / 320;
  const metrics = [
    { label: 'Páginas', value: `${day.pages}` },
    { label: 'Ritmo', value: `${formatPace(day.minutes, day.pages)} /pág` },
    { label: 'Tempo', value: formatDuration(day.minutes) },
  ];

  return (
    <View style={[styles.frame, { width }, template === 'photo' ? styles.photoFrame : undefined]}>
      {template === 'photo' && photoUri ? (
        <>
          <Image source={{ uri: photoUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          <View style={[StyleSheet.absoluteFill, styles.photoShade]} />
        </>
      ) : null}

      <View style={[styles.metrics, { gap: 18 * scale }]}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metric}>
            <Text style={[styles.label, { color: ReadingColors.accent, fontSize: 15 * scale }, template === 'photo' ? styles.shadow : undefined]}>
              {metric.label}
            </Text>
            <Text
              style={[
                styles.value,
                { color: ReadingColors.white, fontSize: 38 * scale, lineHeight: 44 * scale },
                template === 'photo' ? styles.shadow : undefined,
              ]}>
              {metric.value}
            </Text>
          </View>
        ))}
        <View style={{ marginTop: 10 * scale }}>
          <BookOpen size={44 * scale} color={ReadingColors.accent} strokeWidth={2.4} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: 9 / 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  photoFrame: {
    backgroundColor: '#2A2A30',
  },
  photoShade: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
  },
  metrics: {
    alignItems: 'center',
  },
  metric: {
    alignItems: 'center',
  },
  label: {
    fontWeight: '500',
  },
  value: {
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  },
  shadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});
