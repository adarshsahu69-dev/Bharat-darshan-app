import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Stepper } from '@/components/Stepper';
import { formatINR } from '@/data/trips';
import { computeTripBudgetFromTrip } from '@/lib/tripBudget';
import { useTheme } from '@/theme/ThemeProvider';
import { useTripStore } from '@/store/tripStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MANUAL_CATEGORIES = [
  { id: 'travel', label: 'Travel', tone: 'gold' },
  { id: 'guides', label: 'Guides', tone: 'emerald' },
  { id: 'food', label: 'Food', tone: 'secondary' },
] as const;

function accentColor(theme: ReturnType<typeof useTheme>, tone: string): string {
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

export function BudgetEditSheet({ visible, onClose }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const trip = useTripStore((state) => state.trip);
  const setCategoryAmount = useTripStore((state) => state.setCategoryAmount);
  const setPrepaid = useTripStore((state) => state.setPrepaid);

  const budget = computeTripBudgetFromTrip(trip);
  const progress = budget.total > 0 ? Math.min(1, budget.prepaid / budget.total) : 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Edit budget"
      subtitle={`${trip.travelerCount} travelers · updates live`}
    >
      <View style={styles.totalCard}>
        <Text
          style={[
            theme.typography.labelSm,
            { color: theme.colors.primary, textTransform: 'uppercase' },
          ]}
        >
          Total budget
        </Text>
        <Text
          style={[
            theme.typography.headlineSmBold,
            { color: theme.colors.secondary, marginTop: 2 },
          ]}
        >
          {formatINR(budget.total)}
        </Text>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <View style={styles.progressMeta}>
          <Text style={[theme.typography.labelMd, { color: theme.colors.primary }]}>
            {formatINR(budget.prepaid)} of {formatINR(budget.total)} pre-paid
          </Text>
          <Text style={[theme.typography.labelMd, { color: theme.colors.onSurfaceVariant }]}>
            {formatINR(budget.remaining)} left
          </Text>
        </View>

        <View style={styles.perTravelerRow}>
          <MaterialIcons name="person" size={14} color={theme.colors.onSurfaceVariant} />
          <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant }]}>
            {formatINR(budget.perTraveler)} per traveler
          </Text>
        </View>
      </View>

      <Text
        style={[
          theme.typography.labelSm,
          { color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' },
        ]}
      >
        Category split
      </Text>

      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleRow}>
            <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
            <Text style={[theme.typography.labelMd, { color: theme.colors.secondary, fontWeight: '700' }]}>
              Tickets
            </Text>
          </View>
          <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant }]}>
            {formatINR(budget.tickets)}
          </Text>
        </View>
        <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant }]}>
          Calculated from stops × {trip.travelerCount} traveler{trip.travelerCount === 1 ? '' : 's'}
        </Text>
      </View>

      {MANUAL_CATEGORIES.map((category) => {
        const accent = accentColor(theme, category.tone);
        const value = budget[category.id];
        return (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitleRow}>
                <View style={[styles.dot, { backgroundColor: accent }]} />
                <Text style={[theme.typography.labelMd, { color: theme.colors.secondary, fontWeight: '700' }]}>
                  {category.label}
                </Text>
              </View>
              <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant }]}>
                {formatINR(value)}
              </Text>
            </View>
            <Stepper
              label={category.label.toLowerCase()}
              value={value}
              step={100}
              accentColor={accent}
              onChange={(next) => setCategoryAmount(category.id, next)}
            />
          </View>
        );
      })}

      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleRow}>
            <MaterialIcons name="payments" size={16} color={theme.colors.primary} />
            <Text style={[theme.typography.labelMd, { color: theme.colors.secondary, fontWeight: '700' }]}>
              Pre-paid
            </Text>
          </View>
          <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant }]}>
            {formatINR(budget.prepaid)}
          </Text>
        </View>
        <Stepper
          label="pre-paid amount"
          value={budget.prepaid}
          step={100}
          max={Math.max(budget.total, budget.prepaid)}
          accentColor={theme.colors.primary}
          onChange={setPrepaid}
        />
      </View>
    </BottomSheet>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    totalCard: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    progressTrack: {
      height: 10,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.surfaceContainerHigh,
      overflow: 'hidden',
      marginTop: theme.spacing.md,
    },
    progressFill: { height: '100%', borderRadius: theme.radii.full, backgroundColor: theme.colors.primary },
    progressMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    perTravelerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs, marginTop: theme.spacing.sm },
    categoryCard: {
      padding: theme.spacing.md,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
      gap: theme.spacing.sm,
    },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    categoryTitleRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    dot: { width: 10, height: 10, borderRadius: 5 },
  });
}
