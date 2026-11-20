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
  width?: number;
  height?: number;
  contentFit?: ImageContentFit;
  resizeMode?: ImageStyle['resizeMode'];
  accessibilityLabel?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
};

/**
 * Remote image with a graceful fallback.
 *
 * Uses expo-image for disk+memory caching and smooth transitions. A missing or
 * failed URL falls back to a themed placeholder so cards never render blank.
 */
export function SafeImage({
  uri,
  style,
  containerStyle,
  width,
  height,
  contentFit,
  resizeMode = 'cover',
  accessibilityLabel,
  iconName = 'image',
  iconSize = 28,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [failed, setFailed] = useState(false);

  const hasUri = typeof uri === 'string' && uri.trim().length > 0 && !failed;
  const fit = contentFit ?? (resizeMode as ImageContentFit) ?? 'cover';
  const sizeStyle =
    width !== undefined || height !== undefined ? { width, height } : null;

  return (
    <View
      style={[
        styles.container,
        sizeStyle,
        !sizeStyle && !containerStyle ? styles.fill : null,
        containerStyle,
      ]}
    >
      {hasUri ? (
        <Image
          source={{ uri }}
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.colors.surfaceContainer },
            sizeStyle,
            style as any,
          ]}
          contentFit={fit}
          transition={200}
          cachePolicy="memory-disk"
          recyclingKey={uri}
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
    fill: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    fallback: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
  });
}