import type { LucideIcon } from 'lucide-react-native';

import type { ThemePreference } from '@/constants/theme';

export type ThemeOption = {
  id: ThemePreference;
  label: string;
  description: string;
  icon: LucideIcon;
};
