import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getInitials, useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  size?: number;
  accessibilityLabel?: string;
  onPress?: () => void;
};

export function ProfileAvatarButton({
  size = 40,
  accessibilityLabel = 'Open profile',
  onPress,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const displayName = useProfileStore((state) => state.displayName);
  const photoUri = useProfileStore((state) => state.photoUri);
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const [imageError, setImageError] = useState(false);
  const styles = useMemo(() => makeStyles(theme, size), [theme, size]);

  useEffect(() => {
    setImageError(false);
  }, [photoUri]);

  const showPhoto = Boolean(photoUri) && !imageError;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress ?? (() => router.push('/profile'))}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
    >
      {showPhoto ? (
        <Image
          source={{ uri: photoUri as string }}
          style={styles.image}
          contentFit="cover"
          onError={() => setImageError(true)}
          transition={100}
        />
      ) : (
        <View style={styles.fallback}>
          <Text style={[theme.typography.labelMdBold, styles.text]}>
            {initials}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>, size: number) {
  return StyleSheet.create({
    button: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}33`,
    },
    image: {
      width: size,
      height: size,
    },
    fallback: {
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: theme.colors.primary,
      fontSize: Math.max(12, Math.round(size * 0.35)),
      lineHeight: Math.max(16, Math.round(size * 0.45)),
    },
  });
}
