import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MonumentDetail } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  detail?: MonumentDetail;
};

export function ReviewsPreview({ detail }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (!detail) {
    return null;
  }

  return (
    <View style={styles.reviews}>
      <View style={styles.reviewHeader}>
        <Text
          style={[
            theme.typography.headlineSm,
            { color: theme.colors.secondary },
          ]}
        >
          Traveler Reviews
        </Text>
        <Text
          style={[
            theme.typography.labelMd,
            { color: theme.colors.primary, fontWeight: '600' },
          ]}
        >
          All 18k Reviews
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewTop}>
          <View style={styles.reviewIdentity}>
            <View style={styles.reviewAvatar}>
              <Text
                style={[
                  theme.typography.labelSm,
                  { color: theme.colors.onPrimary },
                ]}
              >
                {detail.review.initials}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  theme.typography.labelSm,
                  { color: theme.colors.secondary },
                ]}
              >
                {detail.review.name}
              </Text>
              <Text
                style={[
                  theme.typography.bodySm,
                  { color: theme.colors.outline },
                ]}
              >
                {detail.review.meta}
              </Text>
            </View>
          </View>

          <View style={styles.stars}>
            {Array.from({ length: detail.review.rating }).map((_, index) => (
              <MaterialIcons
                key={index}
                name="star"
                size={14}
                color={theme.colors.gold}
              />
            ))}
          </View>
        </View>

        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.sm },
          ]}
        >
          {detail.review.text}
        </Text>
      </View>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    reviews: {
      marginTop: theme.spacing.xl,
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    reviewCard: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
    },
    reviewTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    reviewIdentity: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    reviewAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    stars: {
      flexDirection: 'row',
      gap: 1,
    },
  });
}
