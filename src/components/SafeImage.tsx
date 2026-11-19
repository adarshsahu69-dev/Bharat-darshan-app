import { MaterialIcons } from '@expo/vector-icons';
import { Image, ImageContentFit } from 'expo-image';
import { useMemo, useState } from 'react';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  /** Container style, used for rounded clipping and sizing. */
  containerStyle?: StyleProp<ViewStyle>;
  resizeMode?: ImageStyle['resizeMode'];
  accessibilityLabel?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
};

/**
 * Image with a graceful fallback.
 *
 * Uses expo-image for disk+memory caching and smooth transitions. A missing or
 * failed URL falls back to a themed placeholder so cards never render blank.
 */
export function SafeImage({
  uri,
  style,
  containerStyle,
  resizeMode = 'cover',
  accessibilityLabel,
  iconName = 'image',
  iconSize = 28,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [failed, setFailed] = useState(false);

  const hasUri = Boolean(uri) && !failed;
  const contentFit = (resizeMode ?? 'cover') as ImageContentFit;

  return (
    <View style={[styles.container, containerStyle]}>
      {hasUri ? (
        <Image
          source={uri}
          style={[StyleSheet.absoluteFill, style as any]}
          contentFit={contentFit}
          transition={200}
          cachePolicy="memory-disk"
          accessibilityLabel={accessibilityLabel}
          onError={(event) => {
            // Log the failing URL so broken image URLs are visible during dev.
            console.warn('[SafeImage] failed to load image', uri, event?.error);
            setFailed(true);
          }}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fallback]}>
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={theme.colors.outline}
          />
        </View>
      )}
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surfaceContainer,
      overflow: 'hidden',
    },
    fallback: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
  });
}