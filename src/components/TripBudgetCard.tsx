import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TripBudgetSegment } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  total: string;
  prepaid: string;
  prepaidNote: string;
  segments: TripBudgetSegment[];
};

export function TripBudgetCard({ total, prepaid, prepaidNote, segments }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const colorFor = (tone: TripBudgetSegment['color']): string => {
    switch (tone) {
      case 'gold':
        return theme.colors.gold;
      case 'emerald':
        return theme.colors.emerald;
      case 'secondary':
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.primary, textTransform: 'uppercase' },
            ]}
          >
            Budget Allocation
          </Text>
          <Text
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.secondary, marginTop: 2 },
            ]}
          >
            {total}
          </Text>
        </View>
        <View style={styles.prepaidWrap}>
          <Text
            style={[
              theme.typography.bodySmStrong,
              { color: theme.colors.primary },
            ]}
          >
            {prepaid}
          </Text>
          <Text
            style={[
              theme.typography.labelMd,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {prepaidNote}
          </Text>
        </View>
      </View>

      <View style={styles.bar}>
        {segments.map((segment) => (
          <View
            key={segment.id}
            style={[
              styles.segment,
              { flex: segment.weight, backgroundColor: colorFor(segment.color) },
            ]}
          />
        ))}
      </View>

      <View style={styles.legend}>
        {segments.map((segment) => (
          <View key={segment.id} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: colorFor(segment.color) },
              ]}
            />
            <View>
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {segment.label}
              </Text>
              <Text
                style={[
                  theme.typography.bodySmStrong,
                  { color: theme.colors.secondary },
                ]}
              >
                {segment.amount}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      ...theme.shadows.warmSoft,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    prepaidWrap: {
      alignItems: 'flex-end',
    },
    bar: {
      flexDirection: 'row',
      height: 12,
      borderRadius: theme.radii.full,
      overflow: 'hidden',
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.surfaceContainerHigh,
    },
    segment: {
      height: '100%',
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.md,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '50%',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.sm,
    },
    legendDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });
}