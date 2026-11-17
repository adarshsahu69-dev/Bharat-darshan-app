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
            <MaterialIcons name="schedule" size={12} color={dotColor} />
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
            <MaterialIcons name="star" size={12} color={theme.colors.gold} />
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

        <Text
          style={[
            theme.typography.titleMd,
            { color: theme.colors.secondary, marginTop: theme.spacing.xs },
          ]}
        >
          {stop.name}
        </Text>

        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, marginTop: 2 },
          ]}
        >
          {stop.description}
        </Text>

        <View style={styles.footer}>
          <Image
            source={{ uri: stop.image }}
            style={styles.thumb}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <View style={styles.ticketCol}>
            <View style={styles.ticketRow}>
              <MaterialIcons
                name="confirmation-number"
                size={14}
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
            <View style={styles.durationRow}>
              <MaterialIcons
                name="schedule"
                size={12}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.onSurfaceVariant },
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
      width: '100%',
      alignSelf: 'stretch',
    },
    rail: {
      width: 40,
      alignSelf: 'stretch',
      alignItems: 'center',
      paddingTop: 4,
    },
    dot: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 3,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    card: {
      flex: 1,
      minWidth: 0,
      alignSelf: 'stretch',
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
      flexShrink: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    ratingRow: {
      flexShrink: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
    thumb: {
      width: 72,
      height: 72,
      flexShrink: 0,
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.surfaceContainer,
    },
    ticketCol: {
      flex: 1,
      minWidth: 0,
      gap: theme.spacing.xs,
    },
    ticketRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    durationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
  });
}