import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SafeImage } from '@/components/SafeImage';
import { Monument } from '@/data/monuments';
import { selectIsSaved, useBookmarkStore } from '@/store/bookmarkStore';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  monument: Monument;
  onPress?: () => void;
};

export function FeaturedCard({ monument, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${monument.name}, ${monument.state}`}
      onPress={onPress}
      style={styles.card}
    >
      <SafeImage
        uri={monument.image}
        style={StyleSheet.absoluteFill}
        accessibilityLabel={monument.name}
      />
      <LinearGradient
        colors={[
          `rgba(${theme.colors.heroScrim}, 0)`,
          `rgba(${theme.colors.heroScrim}, 0.4)`,
          `rgba(${theme.colors.heroScrim}, 0.95)`,
        ]}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.topRow}>
        {monument.isUnesco ? (
          <View style={styles.unescoBadge}>
            <MaterialIcons
              name="verified"
              size={14}
              color={theme.colors.onGold}
            />
            <Text
              style={[theme.typography.labelSm, { color: theme.colors.onGold }]}
            >
              UNESCO World Heritage
            </Text>
          </View>
        ) : (
          <View />
        )}
        <BookmarkButton monumentId={monument.id} />
      </View>

      <View style={styles.bottomContent}>
        <View style={styles.metaRow}>
          <View style={styles.stateChip}>
            <Text
              style={[
                theme.typography.labelSm,
                { color: theme.colors.onPrimary, textTransform: 'uppercase' },
              ]}
            >
              {monument.state}
            </Text>
          </View>
          <View style={styles.ratingRow}>
            <MaterialIcons
              name="star"
              size={12}
              color={theme.colors.goldSoft}
            />
            <Text
              style={[
                theme.typography.bodySmStrong,
                { color: theme.colors.onImage },
              ]}
            >
              {monument.rating.toFixed(1)}
            </Text>
            {monument.reviewCount ? (
              <Text
                style={[
                  theme.typography.bodySm,
                  { color: theme.colors.goldSoft },
                ]}
              >
                ({monument.reviewCount})
              </Text>
            ) : null}
          </View>
        </View>

        <Text
          style={[
            theme.typography.headlineMd,
            { color: theme.colors.onImage, marginTop: 4 },
          ]}
        >
          {monument.name}
        </Text>

        {monument.description ? (
          <Text
            numberOfLines={1}
            style={[
              theme.typography.bodySm,
              { color: theme.colors.onImageMuted, marginTop: 2 },
            ]}
          >
            {monument.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                theme.typography.labelSm,
                { color: theme.colors.onImageFaint },
              ]}
            >
              Entry Fee
            </Text>
            <Text
              style={[
                theme.typography.bodySmStrong,
                { color: theme.colors.onImage, marginTop: 2 },
              ]}
            >
              {monument.ticketLabel}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View Details"
            onPress={onPress}
            hitSlop={6}
            style={({ pressed }) => [
              styles.detailsButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text
              style={[
                theme.typography.labelMdStrong,
                { color: theme.colors.onPrimary },
              ]}
            >
              View Details
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={14}
              color={theme.colors.onPrimary}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function BookmarkButton({ monumentId }: { monumentId: string }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const saved = useBookmarkStore(selectIsSaved(monumentId));
  const toggleSaved = useBookmarkStore((state) => state.toggleSaved);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark this site'}
      accessibilityState={{ selected: saved }}
      onPress={() => toggleSaved(monumentId)}
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
      height: 320,
      borderRadius: theme.radii.hero,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceContainer,
      ...theme.shadows.warm,
    },
    topRow: {
      position: 'absolute',
      top: 16,
      left: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    unescoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.goldContainer,
    },
    bookmarkButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.surface}E6`,
    },
    bottomContent: {
      position: 'absolute',
      bottom: 16,
      left: 16,
      right: 16,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    stateChip: {
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.primary,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.imageBorder,
    },
    detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
  });
}