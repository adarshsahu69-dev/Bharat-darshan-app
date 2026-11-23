import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatINR } from '@/data/trips';
import { TripBudget } from '@/lib/tripBudget';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  budget: TripBudget;
  onPress?: () => void;
};

const CATEGORY_META = [
  { id: 'tickets', label: 'Tickets', tone: 'primary' },
  { id: 'travel', label: 'Travel', tone: 'gold' },
  { id: 'guides', label: 'Guides', tone: 'emerald' },
  { id: 'food', label: 'Food', tone: 'secondary' },
] as const;

type Tone = (typeof CATEGORY_META)[number]['tone'];

function accentFor(theme: ReturnType<typeof useTheme>, tone: Tone): string {
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
}

export function TripBudgetCard({ budget, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const progress = budget.total > 0 ? Math.min(1, budget.prepaid / budget.total) : 0;
  const amounts = {
    tickets: budget.tickets,
    travel: budget.travel,
    guides: budget.guides,
    food: budget.food,
  } as const;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Edit budget allocation"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.96 }]}
    >
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
            {formatINR(budget.total)}
          </Text>
        </View>
        <View style={styles.prepaidWrap}>
          <Text style={[theme.typography.bodySmStrong, { color: theme.colors.primary }]}>
            {formatINR(budget.prepaid)}
          </Text>
          <Text style={[theme.typography.labelMd, { color: theme.colors.onSurfaceVariant }]}>
            of {formatINR(budget.total)} pre-paid
          </Text>
        </View>
        <MaterialIcons
          name="edit"
          size={18}
          color={theme.colors.onSurfaceVariant}
          style={{ marginLeft: theme.spacing.sm }}
        />
      </View>

      <View style={styles.bar}>
        {CATEGORY_META.map((category) => {
          const amount = amounts[category.id];
          const flex = budget.total > 0 ? amount / budget.total : 0;
          if (flex <= 0) return null;
          return (
            <View
              key={category.id}
              style={[
                styles.segment,
                { flex, backgroundColor: accentFor(theme, category.tone) },
              ]}
            />
          );
        })}
        {budget.total === 0 ? <View style={[styles.segment, { flex: 1, backgroundColor: theme.colors.surfaceContainerHigh }]} /> : null}
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>

      <View style={styles.legend}>
        {CATEGORY_META.map((category) => (
          <View key={category.id} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: accentFor(theme, category.tone) }]} />
            <View>
              <Text style={[theme.typography.labelMd, { color: theme.colors.onSurfaceVariant }]}>
                {category.label}
              </Text>
              <Text style={[theme.typography.bodySmStrong, { color: theme.colors.secondary }]}>
                {formatINR(amounts[category.id])}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <MaterialIcons name="person" size={12} color={theme.colors.onSurfaceVariant} />
        <Text style={[theme.typography.labelMd, { color: theme.colors.onSurfaceVariant }]}>
          {formatINR(budget.perTraveler)} / traveler
        </Text>
      </View>
    </Pressable>
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
    headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    prepaidWrap: { alignItems: 'flex-end' },
    bar: {
      flexDirection: 'row',
      height: 12,
      borderRadius: theme.radii.full,
      overflow: 'hidden',
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.surfaceContainerHigh,
    },
    segment: { height: '100%' },
    progressTrack: {
      height: 4,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.surfaceContainerHigh,
      overflow: 'hidden',
      marginTop: theme.spacing.xs,
    },
    progressFill: { height: '100%', borderRadius: theme.radii.full, backgroundColor: theme.colors.primary },
    legend: { flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.spacing.sm },
    legendItem: { flexDirection: 'row', alignItems: 'center', width: '50%', gap: theme.spacing.sm, marginTop: theme.spacing.sm },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
  });
}
