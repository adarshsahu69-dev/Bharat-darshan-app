import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Image,
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
 * The original Stitch `googleusercontent` URLs expire and redirect to a Google
 * login page, so remote images render blank. SafeImage retries once, then shows
 * a themed placeholder instead of an empty box.
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

  return (
    <View style={[styles.container, containerStyle]}>
      {hasUri ? (
        <Image
          source={{ uri }}
          style={[StyleSheet.absoluteFill, style]}
          resizeMode={resizeMode}
          onError={() => setFailed(true)}
          accessibilityIgnoresInvertColors
          accessibilityLabel={accessibilityLabel}
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