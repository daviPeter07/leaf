import { Moon, Sun, SunMoon } from 'lucide-react-native';

import { ACCENT_COLORS, type AccentColor } from '@/constants/theme';
import type { ThemeOption } from '@/settings/types';

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'system', label: 'Sistema', description: 'Acompanha o tema do celular', icon: SunMoon },
  { id: 'light', label: 'Claro', description: 'Fundo branco, sempre', icon: Sun },
  { id: 'dark', label: 'Escuro', description: 'Fundo escuro, sempre', icon: Moon },
];

export const ACCENT_OPTIONS = Object.keys(ACCENT_COLORS) as AccentColor[];
