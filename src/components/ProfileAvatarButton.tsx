import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { getInitials, useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  size?: number;
  accessibilityLabel?: string;
};

export function ProfileAvatarButton({
  size = 40,
  accessibilityLabel = 'Open profile',
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const displayName = useProfileStore((state) => state.displayName);
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const styles = useMemo(() => makeStyles(theme, size), [theme, size]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => router.push('/profile')}
      hitSlop={8}
      style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
    >
      <Text style={[theme.typography.labelMdBold, styles.text]}>{initials}</Text>
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>, size: number) {
  return StyleSheet.create({
    button: {
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 1,
      borderColor: `${theme.colors.primary}33`,
    },
    text: {
      color: theme.colors.primary,
      fontSize: Math.max(12, Math.round(size * 0.35)),
      lineHeight: Math.max(16, Math.round(size * 0.45)),
    },
  });
}
