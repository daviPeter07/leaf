import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { BookOpen, Camera, Image as ImageIcon, Share2, X } from 'lucide-react-native';
import { type ComponentRef, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

import { ActionButton } from '@/components/app/action-button';
import { ReadingColors } from '@/constants/theme';
import { formatDayLabel, getReadingDays } from '@/reading/utils/functions';
import { ShareSticker } from '@/share/components/share-sticker';
import type { StickerTemplate } from '@/share/types';
import { SHARE_BACKGROUND, STICKER_TEMPLATES, STORY_EXPORT_SIZE } from '@/share/utils/constants';
import { useReadingStore } from '@/store/reading-store';

export default function ShareDayScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const sessions = useReadingStore((state) => state.sessions);
  const day = getReadingDays(sessions).find((item) => item.key === date);
  const stickerRef = useRef<ComponentRef<typeof View>>(null);
  const [template, setTemplate] = useState<StickerTemplate>('photo');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const previewWidth = Math.min(width - 96, ((height - 360) * 9) / 16);
  const previewBackground = STICKER_TEMPLATES.find((item) => item.id === template)?.background;

  async function pickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso às fotos para escolher o fundo do status.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Permita acesso à câmera para tirar a foto do status.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [9, 16],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function share() {
    if (!stickerRef.current) {
      return;
    }

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Compartilhamento indisponível', 'Este aparelho não permite compartilhar agora.');
      return;
    }

    // Exported at story resolution; PNG keeps the sticker templates transparent.
    const uri = await captureRef(stickerRef, {
      format: 'png',
      quality: 1,
      ...STORY_EXPORT_SIZE,
    });

    await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Compartilhar leitura', UTI: 'public.png' });
  }

  if (!day) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Esse dia de leitura não existe mais.</Text>
          <ActionButton label="Voltar" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityLabel="Fechar">
          <X size={26} color={ReadingColors.white} />
        </TouchableOpacity>
        <View style={styles.topCopy}>
          <Text style={styles.topTitle}>Compartilhar</Text>
          <Text style={styles.topSubtitle}>{formatDayLabel(day.key)}</Text>
        </View>
        <View style={styles.topSpacer} />
      </View>

      <View style={styles.previewArea}>
        <View style={[styles.preview, { backgroundColor: previewBackground }]}>
          <View ref={stickerRef} collapsable={false}>
            <ShareSticker day={day} template={template} photoUri={photoUri} width={previewWidth} />
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        <View style={styles.templates}>
          {STICKER_TEMPLATES.map((item) => {
            const isSelected = item.id === template;

            return (
              <TouchableOpacity key={item.id} style={styles.template} onPress={() => setTemplate(item.id)}>
                <View
                  style={[
                    styles.templateThumb,
                    { backgroundColor: item.background },
                    isSelected ? styles.templateThumbSelected : undefined,
                  ]}>
                  {item.id === 'photo' ? (
                    <ImageIcon size={18} color={item.iconColor} />
                  ) : (
                    <BookOpen size={18} color={item.iconColor} />
                  )}
                </View>
                <Text style={[styles.templateLabel, isSelected ? styles.templateLabelSelected : undefined]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {template === 'photo' ? (
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Camera size={18} color={ReadingColors.white} />
              <Text style={styles.photoButtonText}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={pickPhoto}>
              <ImageIcon size={18} color={ReadingColors.white} />
              <Text style={styles.photoButtonText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.hint}>Fundo transparente: cole por cima de qualquer foto no story.</Text>
        )}

        <ActionButton label="Compartilhar" onPress={share}>
          <Share2 size={18} color={ReadingColors.white} strokeWidth={2.5} />
        </ActionButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SHARE_BACKGROUND,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  topCopy: {
    flex: 1,
    alignItems: 'center',
  },
  topTitle: {
    color: ReadingColors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  topSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
  },
  topSpacer: {
    width: 26,
  },
  previewArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    overflow: 'hidden',
    borderRadius: 14,
  },
  controls: {
    gap: 18,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  templates: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  template: {
    alignItems: 'center',
    gap: 6,
  },
  templateThumb: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 72,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  templateThumbSelected: {
    borderColor: ReadingColors.accent,
  },
  templateLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  templateLabelSelected: {
    color: ReadingColors.white,
    fontWeight: '700',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  photoButtonText: {
    color: ReadingColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  hint: {
    paddingVertical: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 24,
  },
  missingText: {
    color: ReadingColors.white,
    fontSize: 17,
    textAlign: 'center',
  },
});
