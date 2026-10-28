import { ReadingColors } from '@/constants/theme';
import type { StickerTemplateOption } from '@/share/types';

export const SHARE_BACKGROUND = '#111114';

// Instagram story resolution used for the exported PNG.
export const STORY_EXPORT_SIZE = { width: 1080, height: 1920 };

export const STICKER_TEMPLATES: StickerTemplateOption[] = [
  { id: 'photo', label: 'Foto', background: '#3A3A42', iconColor: ReadingColors.white },
  { id: 'light', label: 'Sticker', background: '#26262C', iconColor: ReadingColors.white },
  { id: 'dark', label: 'Sticker escuro', background: '#E9E9EE', iconColor: ReadingColors.ink },
];
