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
