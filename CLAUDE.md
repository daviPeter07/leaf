# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm start`: start the Expo dev server (`npm run android` / `ios` / `web` open a specific platform)
- `npm run lint`: ESLint via `expo lint` (flat config, `eslint-config-expo`)
- `npx tsc --noEmit`: type-check (strict mode)

There is no test runner configured.

## Project overview

Leaf is a personal reading tracker built with Expo Router, React Native and TypeScript. It runs entirely on the device: there is no backend, and all data is persisted locally. The React Compiler is enabled (`experiments.reactCompiler` in `app.json`), so don't add manual `useMemo`/`useCallback` just for performance.

**All user-facing text is in Brazilian Portuguese** (screen titles, labels, validation messages, permission prompts in `app.json`). Dates are formatted with the `pt-BR` locale.

## Architecture

All source code lives in `src/`, and the `@/*` path alias maps to `./src/*` (`@/assets/*` maps to `./assets/*`). The app is built for a single reader (`readerName: 'Alice'` in the store), and the copy addresses her directly.

- **Routing (`src/app/`)**: the root `_layout.tsx` keeps the splash screen up until the store has loaded from AsyncStorage (`useReadingStoreHydrated`). It then uses `Stack.Protected` to show either `tutorial` (5-card onboarding, first launch only) or the app. Calling `completeTutorial()` flips `hasSeenTutorial`, and the guard swaps the screens automatically, so no manual navigation is needed. The app consists of the `(tabs)` group (Início / Biblioteca / Status), the `add-book`, `edit-book` and `log-reading` modals, `book/[id]`, and `share-day` (full-screen share view). Modals take their target through query params (`id`, `bookId`, `date`) read with `useLocalSearchParams`. Typed routes are disabled.
- **State (`src/store/reading-store.ts`)**: one Zustand store, persisted to AsyncStorage under the key `leaf-reading-v2`. It holds `books`, `sessions` and `hasSeenTutorial` (models in `src/types/reading.ts`), and its actions own all the domain invariants: clamping pages and chapters, deriving `currentChapter` from progress, setting `finishedAt` when `currentPage === totalPages`, and deleting a book's sessions when the book is removed. Put new data rules here, not in screens. Selectors must return stable values (a raw field, or an existing object as `.find` does). A selector that builds a new array or object, like `state.books.filter(...)`, causes an infinite render loop ("Maximum update depth exceeded") in Zustand 5, so filter outside the selector or use `useShallow`. If you change the persisted shape incompatibly, bump the storage key or add a `migrate`.
- **Derived data**: screens read through `src/hooks/use-reading-data.ts`, where `activeBook` is the first unfinished book. Everything calculated lives in `src/utils/reading.ts` and uses `date-fns` with the `ptBR` locale: reading days grouped by **local** date (`getDayKey`, `getReadingDays`), the Monday–Sunday `getWeekSummary`, `getStreak`, and the Strava-style formatters (`formatPace` returns min:ss per page, `formatDuration`). Don't group by `toISOString()` dates, because that uses UTC and moves evening reads to the next day.
- **Share flow**: the Status tab lists reading days, and tapping one opens `share-day`, which renders `ShareSticker` (a 9:16 frame with Páginas / Ritmo / Tempo stacked in the centre and a book icon). The `photo` template paints a camera or gallery image behind the stats. The `light`/`dark` templates have a transparent background, and the PNG export (`captureRef` at 1080×1920, shared via `expo-sharing`) keeps that transparency.
- **Forms**: validated with Zod schemas defined inside the form component or screen (`components/reading/book-form.tsx`, `app/log-reading.tsx`), using local `useState` fields and `safeParse`, with error messages mapped per field. `react-hook-form` is installed but these forms don't use it.
- **Components**: `src/components/app/` holds generic UI pieces (ActionButton, ScreenHeader, EmptyState, StatRow, KeyboardAwareScrollView); `src/components/reading/` holds domain components.
- **Styling**: `StyleSheet` with the light, Strava-inspired palette in `ReadingColors` (`src/constants/theme.ts`): white background, `surface` gray, `accent` orange. The app is light-only (`userInterfaceStyle: "light"`). Icons come from `lucide-react-native`, including the tab icons. The share screen is the only dark screen.
