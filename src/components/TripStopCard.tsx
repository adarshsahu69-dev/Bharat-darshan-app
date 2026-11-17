import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { TripStop } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  stop: TripStop;
  index: number;
  tone: 'primary' | 'secondary' | 'gold';
  onPress?: () => void;
};

export function TripStopCard({ stop, index, tone, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const dotColor =
    tone === 'gold'
      ? theme.colors.gold
      : tone === 'secondary'
        ? theme.colors.secondary
        : theme.colors.primary;

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, { borderColor: dotColor }]}>
          <Text
            style={[theme.typography.labelSm, { color: theme.colors.onImage }]}
          >
            {index + 1}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${stop.name}, ${stop.time}`}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.96 }]}
      >
        <View style={styles.metaRow}>
          <View style={styles.timeRow}>
            <MaterialIcons
              name="schedule"
              size={12}
              color={dotColor}
            />
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {stop.time}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <MaterialIcons
              name="star"
              size={12}
              color={theme.colors.gold}
            />
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.secondary },
              ]}
            >
              {stop.rating.toFixed(1)}
            </Text>
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              ({stop.reviewCount})
            </Text>
          </View>
        </View>

        <View style={styles.contentRow}>
          <Image
            source={{ uri: stop.image }}
            style={styles.thumb}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={2}
              style={[
                theme.typography.titleMd,
                { color: theme.colors.secondary },
              ]}
            >
              {stop.name}
            </Text>
            <Text
              numberOfLines={2}
              style={[
                theme.typography.bodySm,
                { color: theme.colors.onSurfaceVariant, marginTop: 2 },
              ]}
            >
              {stop.description}
            </Text>
            <View style={styles.footer}>
              <View style={styles.ticketRow}>
                <MaterialIcons
                  name="confirmation-number"
                  size={12}
                  color={dotColor}
                />
                <Text
                  style={[
                    theme.typography.labelMd,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {stop.ticketLabel}
                </Text>
              </View>
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.primary },
                ]}
              >
                {stop.duration}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
    },
    rail: {
      width: 24,
      alignItems: 'center',
      paddingTop: 4,
    },
    dot: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    card: {
      flex: 1,
      marginLeft: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      ...theme.shadows.warmSoft,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    contentRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    thumb: {
      width: 72,
      height: 72,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.surfaceContainer,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.xs,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
    ticketRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
  });
}