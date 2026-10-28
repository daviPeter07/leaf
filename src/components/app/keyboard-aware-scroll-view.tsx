import { type ComponentRef, createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextInput,
  ViewStyle,
} from 'react-native';

// Space kept between the focused input and the top of the keyboard.
const KEYBOARD_GAP = 24;
const BASE_BOTTOM_PADDING = 32;

const KeyboardScrollContext = createContext<() => void>(() => {});

// Inputs call this on focus so switching fields while the keyboard is open also scrolls them into view.
export function useScrollToFocusedInput() {
  return useContext(KeyboardScrollContext);
}

type KeyboardAwareScrollViewProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

// Scrolls just enough to lift the focused input above the keyboard, and pads the bottom while the keyboard
// is open so the last fields can scroll up too. Uses plain React Native APIs so it also works in Expo Go,
// and does not rely on Android resizing the window (which edge-to-edge no longer does).
export function KeyboardAwareScrollView({ children, contentContainerStyle }: KeyboardAwareScrollViewProps) {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrollY = useRef(0);
  const keyboardTop = useRef<number | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  function scrollToFocusedInput() {
    const input = TextInput.State.currentlyFocusedInput();

    if (!input || keyboardTop.current === null) {
      return;
    }

    input.measureInWindow((_x, y, _width, height) => {
      if (keyboardTop.current === null) {
        return;
      }

      const overlap = y + height + KEYBOARD_GAP - keyboardTop.current;

      if (overlap > 0) {
        scrollRef.current?.scrollTo({ y: scrollY.current + overlap, animated: true });
      }
    });
  }

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      keyboardTop.current = event.endCoordinates.screenY;
      setKeyboardHeight(event.endCoordinates.height);
      // Wait for the extra bottom padding to be laid out before scrolling.
      setTimeout(scrollToFocusedInput, 60);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      keyboardTop.current = null;
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    scrollY.current = event.nativeEvent.contentOffset.y;
  }

  return (
    <KeyboardScrollContext.Provider value={scrollToFocusedInput}>
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={[contentContainerStyle, { paddingBottom: BASE_BOTTOM_PADDING + keyboardHeight }]}
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </KeyboardScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
});
