import { Image } from "expo-image";
import { BookOpen } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import type { Book } from "@/books/types";
import type { Palette } from "@/constants/theme";
import { useColors, useThemedStyles } from "@/hooks/use-theme";

type BookCoverProps = {
  book: Partial<Pick<Book, "coverColor" | "coverUrl">>;
  size?: "small" | "large";
};

// Shows the cover image when there is one, falling back to the coloured block if it is missing or fails to load.
export function BookCover({ book, size = "small" }: BookCoverProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useColors();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const isLarge = size === "large";
  const showImage = book.coverUrl && book.coverUrl !== failedUrl;

  return (
    <View
      style={[
        styles.cover,
        isLarge ? styles.large : styles.small,
        { backgroundColor: book.coverColor ?? colors.surface },
      ]}
    >
      {showImage ? (
        <Image
          source={book.coverUrl}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={150}
          onError={() => setFailedUrl(book.coverUrl ?? null)}
        />
      ) : (
        <BookOpen
          size={isLarge ? 34 : 22}
          color={book.coverColor ? colors.white : colors.muted}
          strokeWidth={2.2}
        />
      )}
    </View>
  );
}

const createStyles = (colors: Palette) =>
  StyleSheet.create({
    cover: {
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: 8,
    },
    small: {
      width: 52,
      height: 74,
    },
    large: {
      width: 88,
      height: 128,
      borderRadius: 10,
    },
  });

