import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title = 'No places found',
  message = 'Try another filter or search term.',
  actionLabel = 'Reset filters',
  onAction,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialIcons
          name="explore-off"
          size={32}
          color={theme.colors.outline}
        />
      </View>
      <Text
        style={[
          theme.typography.headlineSm,
          { color: theme.colors.secondary },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          theme.typography.bodySm,
          {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
            marginTop: theme.spacing.xs,
          },
        ]}
      >
        {message}
      </Text>
      {onAction && actionLabel ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          onPress={onAction}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text
            style={[theme.typography.labelMd, { color: theme.colors.onPrimary }]}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.page,
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
      marginBottom: theme.spacing.md,
    },
    button: {
      marginTop: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
  });
}