import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { BrandColors } from '@/constants/theme';

type AnimatedSplashProps = {
  onFinish: () => void;
};

// Logo geometry in a 100×100 box, the same drawing as the icons in assets/images: an open book with
// ruled lines and a leaf held like a pen, its stem finishing the last line on the right page.
const BOOK = 'M50 44 C42 38 28 36 14 37 L14 74 C28 73 42 75 50 81 C58 75 72 73 86 74 L86 37 C72 36 58 38 50 44 Z';
const BOOK_LENGTH = 224;
const SPINE = 'M50 44 L50 81';
const SPINE_LENGTH = 37;
const LEAF = 'M24 76 C20 44 42 20 80 20 C82 56 58 80 24 76 Z';
const VEIN = 'M27 73 Q48 54 70 30';
const STEM = 'M27 73 L17 83';
// Quadratic curves as [x0, y0, cx, cy, x1, y1] with their approximate length.
const LINES = [
  { points: [22, 49, 33, 48.5, 42, 52], length: 20.4 },
  { points: [22, 57, 33, 56.5, 42, 60], length: 20.4 },
  { points: [22, 65, 33, 64.5, 40, 67.5], length: 18.4 },
  { points: [58, 60, 63, 58, 67, 58], length: 9.3 },
];
const NIB_OFFSET = 1;

// Timeline in ms: the book draws itself, the leaf comes in and writes each line, then the overlay fades out.
const BOOK_DURATION = 450;
const LEAF_IN_START = 300;
const WRITE_START = 550;
const WRITE_DURATION = 170;
const MOVE_DURATION = 90;
const WRITE_END = WRITE_START + LINES.length * (WRITE_DURATION + MOVE_DURATION) - MOVE_DURATION;
const FADE_START = WRITE_END + 250;
const FADE_DURATION = 300;
const TOTAL = FADE_START + FADE_DURATION;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const progress = (elapsed: number, start: number, duration: number) => clamp((elapsed - start) / duration);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

function pointOnLine([x0, y0, cx, cy, x1, y1]: number[], t: number) {
  const u = 1 - t;
  return { x: u * u * x0 + 2 * u * t * cx + t * t * x1, y: u * u * y0 + 2 * u * t * cy + t * t * y1 };
}

// Where the nib of the leaf is at a given moment.
function nibPosition(elapsed: number) {
  const first = pointOnLine(LINES[0].points, 0);

  if (elapsed < WRITE_START) {
    const t = easeOut(progress(elapsed, LEAF_IN_START, WRITE_START - LEAF_IN_START));
    return { x: first.x + 16 * (1 - t), y: first.y - 16 * (1 - t), opacity: t };
  }

  for (let index = 0; index < LINES.length; index += 1) {
    const lineStart = WRITE_START + index * (WRITE_DURATION + MOVE_DURATION);
    const writeEnd = lineStart + WRITE_DURATION;

    if (elapsed < writeEnd) {
      return { ...pointOnLine(LINES[index].points, progress(elapsed, lineStart, WRITE_DURATION)), opacity: 1 };
    }

    const next = LINES[index + 1];

    if (next && elapsed < writeEnd + MOVE_DURATION) {
      const from = pointOnLine(LINES[index].points, 1);
      const to = pointOnLine(next.points, 0);
      const t = easeInOut(progress(elapsed, writeEnd, MOVE_DURATION));
      return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, opacity: 1 };
    }
  }

  return { ...pointOnLine(LINES[LINES.length - 1].points, 1), opacity: 1 };
}

// Plays once over the app after the native splash (plain orange) is hidden, then unmounts through onFinish.
export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const { width } = useWindowDimensions();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let start: number | undefined;
    let frame = 0;

    const tick = (now: number) => {
      start ??= now;
      const time = now - start;
      setElapsed(time);

      if (time < TOTAL) {
        frame = requestAnimationFrame(tick);
      } else {
        onFinish();
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onFinish]);

  const size = Math.min(width * 0.68, 300);
  const book = easeInOut(progress(elapsed, 0, BOOK_DURATION));
  const nib = nibPosition(elapsed);
  const fade = easeInOut(progress(elapsed, FADE_START, FADE_DURATION));

  return (
    <View style={[styles.overlay, { opacity: 1 - fade }]} pointerEvents={fade > 0 ? 'none' : 'auto'}>
      <View style={{ transform: [{ scale: 1 + fade * 0.08 }] }}>
        {/* Centred on the book (x = 50), like the icons, with room for the leaf on the right. */}
        <Svg width={size} height={(size * 70) / 100} viewBox="0 16 100 70">
          <G stroke={BrandColors.white} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <Path d={BOOK} strokeWidth={4.5} strokeDasharray={[BOOK_LENGTH, BOOK_LENGTH]} strokeDashoffset={BOOK_LENGTH * (1 - book)} />
            {book > 0.5 ? (
              <Path
                d={SPINE}
                strokeWidth={4.5}
                strokeDasharray={[SPINE_LENGTH, SPINE_LENGTH]}
                strokeDashoffset={SPINE_LENGTH * (1 - (book - 0.5) * 2)}
              />
            ) : null}
            {LINES.map((line, index) => {
              const written = progress(elapsed, WRITE_START + index * (WRITE_DURATION + MOVE_DURATION), WRITE_DURATION);
              const [x0, y0, cx, cy, x1, y1] = line.points;

              return written > 0 ? (
                <Path
                  key={index}
                  d={`M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`}
                  strokeWidth={3}
                  strokeDasharray={[line.length, line.length]}
                  strokeDashoffset={line.length * (1 - written)}
                />
              ) : null;
            })}
          </G>
          <G
            opacity={nib.opacity}
            transform={`translate(${nib.x + NIB_OFFSET} ${nib.y}) rotate(-8) scale(0.5) translate(-17 -83)`}>
            <Path d={LEAF} fill={BrandColors.accent} stroke={BrandColors.accent} strokeWidth={14} strokeLinejoin="round" />
            <Path d={STEM} stroke={BrandColors.accent} strokeWidth={16} strokeLinecap="round" />
            <Path d={LEAF} fill={BrandColors.white} />
            <Path d={VEIN} stroke={BrandColors.accent} strokeWidth={5} strokeLinecap="round" fill="none" />
            <Path d={STEM} stroke={BrandColors.white} strokeWidth={7} strokeLinecap="round" />
          </G>
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.accent,
    zIndex: 10,
  },
});
