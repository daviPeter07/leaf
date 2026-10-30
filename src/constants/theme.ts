export type Palette = {
  background: string;
  surface: string;
  line: string;
  ink: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  danger: string;
  white: string;
};

export const LightColors: Palette = {
  background: '#FFFFFF',
  surface: '#F4F4F6',
  line: '#E7E7EB',
  ink: '#1C1C21',
  text: '#45454D',
  muted: '#8B8B94',
  accent: '#F26A2E',
  accentSoft: '#FFEFE7',
  danger: '#D6453D',
  white: '#FFFFFF',
};

export const DarkColors: Palette = {
  background: '#0F0F12',
  surface: '#1C1C21',
  line: '#2C2C33',
  ink: '#F3F3F6',
  text: '#C8C8D0',
  muted: '#8B8B94',
  accent: '#F47A43',
  accentSoft: '#3A2117',
  danger: '#FF6B61',
  white: '#FFFFFF',
};

// Theme-independent colours for the share flow: its screen is always dark and the exported image must
// look the same whatever theme the reader uses.
export const BrandColors = {
  accent: LightColors.accent,
  white: '#FFFFFF',
};

export type ThemePreference = 'system' | 'light' | 'dark';

export type AccentColor = 'orange' | 'blue' | 'green' | 'purple' | 'pink' | 'teal' | 'amber';

type AccentShades = Pick<Palette, 'accent' | 'accentSoft'>;

// Primary colour picked in Ajustes. Each one has a shade for the light theme and a brighter one for the dark theme.
export const ACCENT_COLORS: Record<AccentColor, { label: string; light: AccentShades; dark: AccentShades }> = {
  orange: {
    label: 'Laranja',
    light: { accent: LightColors.accent, accentSoft: LightColors.accentSoft },
    dark: { accent: DarkColors.accent, accentSoft: DarkColors.accentSoft },
  },
  blue: {
    label: 'Azul',
    light: { accent: '#2F80ED', accentSoft: '#E8F1FD' },
    dark: { accent: '#5B9BF0', accentSoft: '#172A42' },
  },
  green: {
    label: 'Verde',
    light: { accent: '#2E9D6A', accentSoft: '#E5F5EC' },
    dark: { accent: '#4CC08A', accentSoft: '#15301F' },
  },
  purple: {
    label: 'Roxo',
    light: { accent: '#7B5CE0', accentSoft: '#EFEAFC' },
    dark: { accent: '#9B82EE', accentSoft: '#261E40' },
  },
  pink: {
    label: 'Rosa',
    light: { accent: '#E0457B', accentSoft: '#FDE8F0' },
    dark: { accent: '#EE6B98', accentSoft: '#3D1826' },
  },
  teal: {
    label: 'Turquesa',
    light: { accent: '#0F9AA8', accentSoft: '#E2F5F7' },
    dark: { accent: '#33BAC7', accentSoft: '#10302F' },
  },
  amber: {
    label: 'Âmbar',
    light: { accent: '#D9962B', accentSoft: '#FBF2E2' },
    dark: { accent: '#E8AE4C', accentSoft: '#3A2C14' },
  },
};

const paletteCache = new Map<string, Palette>();

// Returns the same object for the same theme and accent, so palette-keyed caches (useThemedStyles) keep working.
export function getPalette(isDark: boolean, accentColor: AccentColor): Palette {
  const key = `${isDark ? 'dark' : 'light'}-${accentColor}`;
  let palette = paletteCache.get(key);

  if (!palette) {
    const accent = ACCENT_COLORS[accentColor] ?? ACCENT_COLORS.orange;
    palette = { ...(isDark ? DarkColors : LightColors), ...(isDark ? accent.dark : accent.light) };
    paletteCache.set(key, palette);
  }

  return palette;
}
