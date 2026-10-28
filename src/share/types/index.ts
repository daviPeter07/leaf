export type StickerTemplate = 'photo' | 'light' | 'dark';

export type StickerTemplateOption = {
  id: StickerTemplate;
  label: string;
  background: string;
  iconColor: string;
};
