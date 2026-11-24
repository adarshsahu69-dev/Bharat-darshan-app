import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  bottomInset: number;
  onDirections: () => void;
  onAddToTrip: () => void;
};

export function MonumentActionBar({
  bottomInset,
  onDirections,
  onAddToTrip,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View
      style={[
        styles.footer,
        { paddingBottom: Math.max(bottomInset, theme.spacing.md) },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Get directions"
        onPress={onDirections}
        style={({ pressed }) => [
          styles.directionsButton,
          pressed && { opacity: 0.9 },
        ]}
      >
        <MaterialIcons
          name="directions"
          size={18}
          color={theme.colors.secondary}
        />
        <Text
          style={[
            theme.typography.labelMd,
            { color: theme.colors.secondary },
          ]}
        >
          Directions
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add to trip"
        onPress={onAddToTrip}
        style={({ pressed }) => [
          styles.addToTripButton,
          pressed && { opacity: 0.92 },
        ]}
      >
        <MaterialIcons
          name="playlist-add"
          size={18}
          color={theme.colors.onPrimary}
        />
        <Text
          style={[
            theme.typography.labelMd,
            { color: theme.colors.onPrimary },
          ]}
        >
          Add to Trip
        </Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
    directionsButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    addToTripButton: {
      flex: 1.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
  });
}
