import type { StickerTemplateOption } from '@/share/types';

export const SHARE_BACKGROUND = '#111114';

// Instagram story resolution used for the exported PNG.
export const STORY_EXPORT_SIZE = { width: 1080, height: 1920 };

export const STICKER_TEMPLATES: StickerTemplateOption[] = [
  { id: 'photo', label: 'Foto', background: '#3A3A42' },
  { id: 'sticker', label: 'Sticker', background: '#26262C' },
];
