import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeImage } from '@/components/SafeImage';
import { MapPreview } from '@/data/map';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  preview: MapPreview;
  saved: boolean;
  onToggleSave: () => void;
  onViewDetails: () => void;
};

/**
 * Bottom sheet preview card for the selected monument. Shared by the native
 * map and the web preview canvas so both stay in sync.
 */
export function MapPreviewSheet({
  preview,
  saved,
  onToggleSave,
  onViewDetails,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <View style={styles.handle} />

      <View style={styles.cardBody}>
        <View style={styles.thumbWrap}>
          <SafeImage
            uri={preview.image}
            style={styles.thumb}
            accessibilityLabel={preview.name}
          />
          <View style={styles.thumbRating}>
            <MaterialIcons name="star" size={10} color={theme.colors.gold} />
            <Text style={[theme.typography.labelSm, { color: theme.colors.gold }]}>
              {preview.rating.toFixed(1)}
            </Text>
          </View>
          <View style={styles.thumbPano}>
            <MaterialIcons name="360" size={12} color={theme.colors.onImage} />
            <Text
              style={[theme.typography.labelSm, { color: theme.colors.onImage }]}
            >
              360°
            </Text>
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.metaRow}>
            {preview.isUnesco ? (
              <View style={styles.unescoBadge}>
                <Text
                  style={[theme.typography.labelSm, { color: theme.colors.onGold }]}
                >
                  UNESCO
                </Text>
              </View>
            ) : null}
            <Text
              style={[
                theme.typography.bodySm,
                { color: theme.colors.primary, fontWeight: '600' },
              ]}
            >
              {preview.distanceLabel}
            </Text>
            <View style={{ flex: 1 }} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                saved ? 'Remove bookmark' : 'Bookmark this site'
              }
              accessibilityState={{ selected: saved }}
              onPress={onToggleSave}
              hitSlop={8}
              style={styles.bookmark}
            >
              <MaterialIcons
                name={saved ? 'bookmark' : 'bookmark-border'}
                size={18}
                color={saved ? theme.colors.primary : theme.colors.secondary}
              />
            </Pressable>
          </View>

          <Text
            numberOfLines={1}
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.secondary, marginTop: 2 },
            ]}
          >
            {preview.name}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              theme.typography.bodySm,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {preview.location}
          </Text>

          <View style={styles.cardFooter}>
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.secondary, fontWeight: '700' },
              ]}
            >
              {preview.priceLabel}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View details for ${preview.name}`}
              onPress={onViewDetails}
              style={({ pressed }) => [
                styles.detailsButton,
                pressed && { opacity: 0.9 },
              ]}
            >
              <Text
                style={[theme.typography.labelSm, { color: theme.colors.onPrimary }]}
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
      </View>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      marginHorizontal: theme.spacing.page,
      padding: theme.spacing.lg,
      borderRadius: theme.radii.xl,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}80`,
      ...theme.shadows.warm,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.outlineVariant,
      alignSelf: 'center',
      marginBottom: theme.spacing.md,
    },
    cardBody: {
      flexDirection: 'row',
      gap: theme.spacing.lg,
    },
    thumbWrap: {
      width: 112,
      height: 112,
      borderRadius: theme.radii.md,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceContainer,
    },
    thumb: {
      width: '100%',
      height: '100%',
    },
    thumbRating: {
      position: 'absolute',
      top: 6,
      left: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: theme.radii.chip,
      backgroundColor: `rgba(${theme.colors.blackScrim}, 0.6)`,
    },
    thumbPano: {
      position: 'absolute',
      bottom: 6,
      left: 6,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: theme.radii.chip,
      backgroundColor: `rgba(${theme.colors.blackScrim}, 0.6)`,
    },
    info: {
      flex: 1,
      minWidth: 0,
      justifyContent: 'space-between',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    unescoBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: theme.radii.xs,
      backgroundColor: theme.colors.goldContainer,
    },
    bookmark: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
    detailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: 8,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
  });
}