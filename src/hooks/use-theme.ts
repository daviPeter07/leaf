import { useColorScheme } from 'react-native';

import { getPalette, type Palette } from '@/constants/theme';
import { useReadingStore } from '@/store/reading-store';

export function useIsDark() {
  const preference = useReadingStore((state) => state.themePreference);
  const systemScheme = useColorScheme();

  return preference === 'system' ? systemScheme === 'dark' : preference === 'dark';
}

export function useColors(): Palette {
  const isDark = useIsDark();
  const accentColor = useReadingStore((state) => state.accentColor);

  return getPalette(isDark, accentColor);
}

const styleCache = new WeakMap<object, WeakMap<Palette, unknown>>();

// Builds a component's StyleSheet for the active palette, once per palette.
export function useThemedStyles<T>(createStyles: (colors: Palette) => T): T {
  const colors = useColors();
  let byPalette = styleCache.get(createStyles);

  if (!byPalette) {
    byPalette = new WeakMap();
    styleCache.set(createStyles, byPalette);
  }

  if (!byPalette.has(colors)) {
    byPalette.set(colors, createStyles(colors));
  }

  return byPalette.get(colors) as T;
}
