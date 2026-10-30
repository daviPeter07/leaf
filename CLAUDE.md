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

**Modules.** Domain code is split into module folders directly under `src/`: `books`, `reading`, `share`, `tutorial` and `settings`. They replace the old `components/reading/`, `types/` and `utils/` folders. Every module uses the same layout, and a file or folder only exists when the module needs it:
- `components/`: the module's components
- `types/index.ts`: the module's types
- `utils/functions.ts`: pure helpers
- `utils/zod.ts`: Zod schemas plus their `z.infer` types
- `utils/constants.ts`: module constants

Anything shared across modules stays global: `src/components/app/` (generic UI such as `FormField`, `StatRow`, `BottomSheet` (the custom animated modal used for pickers) and `NumberField`, the numeric input with −/+ buttons, configurable `quickSteps` shortcuts and a `maxLabel` jump-to-max chip), `src/constants/theme.ts` (the palette), `src/store/` and `src/hooks/`. Routes stay in `src/app/` because Expo Router requires that, and they import from the modules. Import directly from each file (`@/books/utils/functions`); there are no barrel files apart from `types/index.ts`.

- **Routing (`src/app/`)**: the root `_layout.tsx` keeps the splash screen up until the store has loaded from AsyncStorage (`useReadingStoreHydrated`). It then uses `Stack.Protected` to show either `tutorial` (6-card onboarding from `src/tutorial/utils/constants.ts`, first launch only; keep its copy in sync with the screens) or the app. Calling `completeTutorial()` flips `hasSeenTutorial`, and the guard swaps the screens automatically, so no manual navigation is needed. The app consists of the `(tabs)` group (Início / Biblioteca / Status / Ajustes), the `add-book`, `edit-book` and `log-reading` modals, `book/[id]`, and `share-day` (full-screen share view). Modals take their target through query params (`id`, `bookId`, `date`) read with `useLocalSearchParams`. Typed routes are disabled.
- **State (`src/store/reading-store.ts`)**: one Zustand store, persisted to AsyncStorage under the key `leaf-reading-v2`. It holds `books`, `sessions` and `hasSeenTutorial` (models in `src/books/types` and `src/reading/types`), and its actions own all the domain invariants: clamping pages and chapters, deriving `currentChapter` from progress, setting `finishedAt` when `currentPage === totalPages`, and deleting a book's sessions when the book is removed. Put new data rules here, not in screens. Selectors must return stable values (a raw field, or an existing object as `.find` does). A selector that builds a new array or object, like `state.books.filter(...)`, causes an infinite render loop ("Maximum update depth exceeded") in Zustand 5, so filter outside the selector or use `useShallow`. If you change the persisted shape incompatibly, bump the storage key or add a `migrate`.
- **Derived data**: screens read through `src/hooks/use-reading-data.ts`, where `activeBook` is the first unfinished book. Reading calculations live in `src/reading/utils/functions.ts` (book progress and totals are in `src/books/utils/functions.ts`) and use `date-fns` with the `ptBR` locale: reading days grouped by **local** date (`getDayKey`, `getReadingDays`), the Monday–Sunday `getWeekSummary`, `getStreak`, and the Strava-style formatters (`formatPace` returns min:ss per page, `formatDuration`). Don't group by `toISOString()` dates, because that uses UTC and moves evening reads to the next day.
- **Share flow**: the Status tab lists reading days, and tapping one opens `share-day`, which renders `src/share/components/share-sticker.tsx` (a 9:16 frame with Páginas / Ritmo / Tempo stacked in the centre and a book icon). The `photo` template paints a camera or gallery image behind the stats. The `sticker` template has a transparent background, and the PNG export (`captureRef` at 1080×1920, shared via `expo-sharing`) keeps that transparency. The labels and the book icon are orange and the values are white. Templates and the export size are in `src/share/utils/constants.ts`.
- **Book search**: `add-book` searches Open Library through `searchBooks` (`src/books/utils/functions.ts`). There is no API key, and the response is validated with `openLibrarySearchSchema` because that API is marked experimental. A picked result prefills title, author and pages (`BookForm` `initialValues`, remounted through `key`) and stores `coverUrl` on the book. `BookCover` shows that image with `expo-image` and falls back to `coverColor` if it is missing or fails to load. Chapters are always typed by hand, because no public API provides them reliably.
- **Keyboard**: form screens wrap their content in `KeyboardAwareScrollView` (`src/components/app/`). When the keyboard opens, it measures the focused input and scrolls just enough to keep it above the keyboard. It uses only React Native APIs because `react-native-keyboard-controller` does not run in Expo Go. Any new text input must call `useScrollToFocusedInput()` in its `onFocus`, as `FormField`, `NumberField` and `BookSearch` do, so that switching fields while the keyboard is open also scrolls.
- **Forms**: validated with the Zod schemas in each module's `utils/zod.ts` (`bookSchema`, `readingSchema`), using local `useState` fields and `safeParse`, with error messages mapped per field. `react-hook-form` is installed but these forms don't use it.
- **Styling and theme**: light and dark themes. `src/constants/theme.ts` defines the `LightColors` and `DarkColors` palettes, which share the same keys. `themePreference` in the store (`system`/`light`/`dark`, changed in the Ajustes tab through `src/settings/components/theme-sheet.tsx`) together with `useColorScheme()` picks the base palette, and `accentColor` in the store (a key of `ACCENT_COLORS`, changed in Ajustes through `src/settings/components/accent-sheet.tsx`) overrides its `accent`/`accentSoft`. `getPalette` builds and caches one object per theme and accent, so palette identity stays stable; `app.json` uses `userInterfaceStyle: "automatic"`. Components never import a palette directly. They declare `const createStyles = (colors: Palette) => StyleSheet.create({...})` at module level, call `useThemedStyles(createStyles)`, which caches one sheet per palette, and call `useColors()` for inline colours (icons). Both hooks come from `src/hooks/use-theme.ts`. The exception is the share flow (`share-day` and `ShareSticker`): its screen is always dark and the exported image must not depend on the theme, so it uses the fixed `BrandColors`. Icons come from `lucide-react-native`.
