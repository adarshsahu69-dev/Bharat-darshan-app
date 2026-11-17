import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SafeImage } from '@/components/SafeImage';
import { Monument } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  monument: Monument;
  onPress?: () => void;
};

export function ExploreCard({ monument, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${monument.name}, ${monument.locationLabel ?? monument.city}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.96 }]}
    >
      <View style={styles.imageWrap}>
        <SafeImage
          uri={monument.image}
          style={StyleSheet.absoluteFill}
          accessibilityLabel={monument.name}
        />
        <LinearGradient
          colors={[
            `rgba(${theme.colors.blackScrim}, 0.2)`,
            `rgba(${theme.colors.blackScrim}, 0)`,
            `rgba(${theme.colors.blackScrim}, 0.6)`,
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        {monument.badge ? (
          <View style={styles.badge}>
            <MaterialIcons
              name="verified"
              size={12}
              color={theme.colors.onGold}
            />
            <Text
              style={[theme.typography.labelSm, { color: theme.colors.onGold }]}
            >
              {monument.badge}
            </Text>
          </View>
        ) : null}

        <BookmarkButton initiallySaved={monument.initiallySaved ?? false} />

        <View style={styles.imageFooter}>
          <View style={{ flex: 1 }}>
            {monument.eyebrow ? (
              <Text
                style={[
                  theme.typography.labelSm,
                  {
                    color: theme.colors.goldSoft,
                    textTransform: 'uppercase',
                  },
                ]}
              >
                {monument.eyebrow}
              </Text>
            ) : null}
            <Text
              style={[
                theme.typography.headlineSmBold,
                { color: theme.colors.onImage, marginTop: 2 },
              ]}
            >
              {monument.name}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <MaterialIcons
              name="star"
              size={12}
              color={theme.colors.gold}
            />
            <Text
              style={[
                theme.typography.labelSm,
                { color: theme.colors.onImage },
              ]}
            >
              {monument.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {monument.description ? (
          <Text
            style={[
              theme.typography.bodySmMedium,
              {
                color: theme.colors.onSurfaceVariant,
                marginBottom: theme.spacing.md,
              },
            ]}
          >
            {monument.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <View style={styles.locationRow}>
              <MaterialIcons
                name="location-on"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  theme.typography.bodySmMedium,
                  { color: theme.colors.secondary },
                ]}
              >
                {monument.locationLabel ??
                  `${monument.city}, ${monument.state}`}
              </Text>
            </View>
            <Text
              style={[
                theme.typography.bodySm,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              •
            </Text>
            <Text
              style={[
                theme.typography.bodySmStrong,
                { color: theme.colors.onSurface },
              ]}
            >
              {monument.ticketLabel}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View details for ${monument.name}`}
            onPress={onPress}
            hitSlop={6}
            style={({ pressed }) => [
              styles.viewDetails,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={[
                theme.typography.labelMdBold,
                { color: theme.colors.primary },
              ]}
            >
              View Details
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={14}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function BookmarkButton({ initiallySaved }: { initiallySaved: boolean }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [saved, setSaved] = useState(initiallySaved);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark this site'}
      accessibilityState={{ selected: saved }}
      onPress={() => setSaved((value) => !value)}
      hitSlop={8}
      style={({ pressed }) => [
        styles.bookmarkButton,
        pressed && { opacity: 0.85 },
      ]}
    >
      <MaterialIcons
        name={saved ? 'bookmark' : 'bookmark-border'}
        size={18}
        color={saved ? theme.colors.primary : theme.colors.secondary}
      />
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      borderRadius: theme.radii.xl,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      ...theme.shadows.warmSoft,
    },
    imageWrap: {
      height: 192,
      width: '100%',
    },
    badge: {
      position: 'absolute',
      top: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.goldContainer,
    },
    bookmarkButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.surface}E6`,
    },
    imageFooter: {
      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: theme.radii.md,
      backgroundColor: `${theme.colors.secondary}CC`,
    },
    body: {
      padding: 16,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    viewDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });
}