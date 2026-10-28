import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { DarkColors, LightColors, type Palette } from '@/constants/theme';
import { useIsDark } from '@/hooks/use-theme';
import { useReadingStore, useReadingStoreHydrated } from '@/store/reading-store';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function navigationTheme(base: typeof DefaultTheme, colors: Palette) {
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.background,
      text: colors.ink,
      border: colors.line,
    },
  };
}

const lightTheme = navigationTheme(DefaultTheme, LightColors);
const darkTheme = navigationTheme(DarkTheme, DarkColors);

export default function RootLayout() {
  const hydrated = useReadingStoreHydrated();
  const hasSeenTutorial = useReadingStore((state) => state.hasSeenTutorial);
  const isDark = useIsDark();
  const colors = isDark ? DarkColors : LightColors;

  useEffect(() => {
    if (hydrated) {
      SplashScreen.hideAsync();
    }
  }, [hydrated]);

  // Wait for the persisted state, otherwise the tutorial would flash for returning users.
  if (!hydrated) {
    return null;
  }

  return (
    <ThemeProvider value={isDark ? darkTheme : lightTheme}>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTintColor: colors.ink,
          headerTitleStyle: { fontWeight: '700' },
          headerBackButtonDisplayMode: 'minimal',
        }}>
        <Stack.Protected guard={hasSeenTutorial}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="add-book" options={{ presentation: 'modal', title: 'Novo livro' }} />
          <Stack.Screen name="edit-book" options={{ presentation: 'modal', title: 'Editar livro' }} />
          <Stack.Screen name="log-reading" options={{ presentation: 'modal', title: 'Registrar leitura' }} />
          <Stack.Screen name="book/[id]" options={{ title: '' }} />
          <Stack.Screen name="share-day" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!hasSeenTutorial}>
          <Stack.Screen name="tutorial" options={{ headerShown: false, animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
