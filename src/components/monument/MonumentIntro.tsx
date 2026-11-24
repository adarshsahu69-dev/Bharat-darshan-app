import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Monument, MonumentDetail } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  monument: Monument;
  detail?: MonumentDetail;
};

export function MonumentIntro({ monument, detail }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View>
      <Text
        style={[
          theme.typography.labelSm,
          { color: theme.colors.primary, textTransform: 'uppercase' },
        ]}
      >
        {detail?.dynasty ?? monument.eyebrow ?? monument.category}
      </Text>
      <Text
        style={[
          theme.typography.headlineLgMobile,
          { color: theme.colors.secondary, marginTop: 2 },
        ]}
      >
        {monument.name}
      </Text>
      <View style={styles.addressRow}>
        <MaterialIcons
          name="location-on"
          size={14}
          color={theme.colors.primary}
        />
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, flexShrink: 1 },
          ]}
        >
          {detail?.address ?? `${monument.city}, ${monument.state}`}
        </Text>
      </View>

      <View style={styles.ratingRow}>
        <View style={styles.ratingValueRow}>
          <MaterialIcons name="star" size={18} color={theme.colors.gold} />
          <Text
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.gold },
            ]}
          >
            {monument.rating.toFixed(1)}
          </Text>
        </View>
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          ({detail?.reviewCount ?? monument.reviewCount ?? 'reviews'})
        </Text>
        <Text style={{ color: theme.colors.outline }}>|</Text>
        <View style={styles.verifiedRow}>
          <MaterialIcons
            name="verified-user"
            size={14}
            color={theme.colors.emerald}
          />
          <Text
            style={[
              theme.typography.bodySm,
              { color: theme.colors.secondary, fontWeight: '600' },
            ]}
          >
            Verified Heritage
          </Text>
        </View>
      </View>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    addressRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.outlineVariant}4D`,
    },
    ratingValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    verifiedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });
}
