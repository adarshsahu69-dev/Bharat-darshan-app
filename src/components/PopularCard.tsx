import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Monument } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  monument: Monument;
  onPress?: () => void;
};

export function PopularCard({ monument, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${monument.name}, ${monument.city}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.92 },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: monument.image }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />

        <View style={styles.ratingBadge}>
          <MaterialIcons
            name="star"
            size={12}
            color={theme.colors.gold}
          />
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.gold },
            ]}
          >
            {monument.rating.toFixed(1)}
          </Text>
        </View>

        <View style={styles.categoryBadge}>
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.onImage },
            ]}
          >
            {monument.category}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View>
          <Text
            style={[
              theme.typography.titleLg,
              { color: theme.colors.secondary },
            ]}
          >
            {monument.name}
          </Text>
          <View style={styles.locationRow}>
            <MaterialIcons
              name="location-on"
              size={12}
              color={theme.colors.primary}
            />
            <Text
              style={[
                theme.typography.bodySm,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {monument.city}, {monument.state}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text
            style={[
              theme.typography.bodySmStrong,
              { color: theme.colors.primary },
            ]}
          >
            {formatDistance(monument.distanceKm)}
          </Text>
          <Text
            style={[
              theme.typography.labelMd,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {monument.ticketLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function formatDistance(km?: number): string {
  if (km === undefined) {
    return '';
  }

  const value =
    km >= 100
      ? Math.round(km)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      : km.toFixed(1);

  return `${value} km away`;
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      width: 256,
      borderRadius: theme.radii.card,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      ...theme.shadows.warmSoft,
    },
    imageWrap: {
      height: 144,
      width: '100%',
    },
    ratingBadge: {
      position: 'absolute',
      top: 10,
      right: 10,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      backgroundColor: `${theme.colors.surface}E6`,
    },
    categoryBadge: {
      position: 'absolute',
      bottom: 8,
      left: 8,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: theme.radii.md,
      backgroundColor: `${theme.colors.secondary}CC`,
    },
    body: {
      padding: 14,
      flex: 1,
      justifyContent: 'space-between',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
  });
}