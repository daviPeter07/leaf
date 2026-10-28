import { type ReactNode, useEffect, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Palette } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
};

// Sheet that slides up from the bottom over a fading backdrop; tapping outside or the back button closes it.
// The Modal stays mounted until the closing animation finishes.
export function BottomSheet({ visible, onClose, title, description, children }: BottomSheetProps) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [progress] = useState(() => new Animated.Value(0));
  const [isMounted, setIsMounted] = useState(visible);

  if (visible && !isMounted) {
    setIsMounted(true);
  }

  useEffect(() => {
    if (visible) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setIsMounted(false);
      }
    });
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height * 0.5, 0] });

  return (
    <Modal visible={isMounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fechar" />
        </Animated.View>
        <Animated.View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8, transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    sheet: {
      paddingHorizontal: 20,
      paddingTop: 10,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      backgroundColor: colors.background,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 5,
      marginBottom: 16,
      borderRadius: 999,
      backgroundColor: colors.line,
    },
    title: {
      color: colors.ink,
      fontSize: 20,
      fontWeight: '800',
    },
    description: {
      marginTop: 4,
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
    },
    content: {
      marginTop: 18,
    },
  });
