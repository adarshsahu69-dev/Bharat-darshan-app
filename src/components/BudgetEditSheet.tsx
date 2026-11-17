import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Stepper } from '@/components/Stepper';
import { formatINR, tripPerTraveler, tripPrepaid } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';
import { useTripStore } from '@/store/tripStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const CATEGORY_ACCENT: Record<string, 'primary' | 'gold' | 'emerald' | 'secondary'> = {
  tickets: 'primary',
  travel: 'gold',
  guides: 'emerald',
  food: 'secondary',
};

function accentColor(
  theme: ReturnType<typeof useTheme>,
  tone: string,
): string {
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
  const setTotalBudget = useTripStore((state) => state.setTotalBudget);
  const setCategoryAmount = useTripStore((state) => state.setCategoryAmount);
  const setCategoryPrepaid = useTripStore((state) => state.setCategoryPrepaid);
  const toggleCategoryPrepaid = useTripStore(
    (state) => state.toggleCategoryPrepaid,
  );

  const prepaid = tripPrepaid(trip);
  const perTraveler = tripPerTraveler(trip);
  const remaining = Math.max(0, trip.totalBudget - prepaid);
  const progress =
    trip.totalBudget > 0
      ? Math.min(1, prepaid / trip.totalBudget)
      : 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Edit budget"
      subtitle={`${trip.travelerCount} travelers · updates live`}
    >
      {/* Total + progress */}
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
          {formatINR(trip.totalBudget)}
        </Text>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.round(progress * 100)}%` },
            ]}
          />
        </View>
        <View style={styles.progressMeta}>
          <Text
            style={[theme.typography.labelMd, { color: theme.colors.primary }]}
          >
            {formatINR(prepaid)} of {formatINR(trip.totalBudget)} pre-paid
          </Text>
          <Text
            style={[theme.typography.labelMd, { color: theme.colors.onSurfaceVariant }]}
          >
            {formatINR(remaining)} left
          </Text>
        </View>

        <View style={styles.totalStepperRow}>
          <Stepper
            label="total budget"
            value={trip.totalBudget}
            step={500}
            onChange={setTotalBudget}
          />
        </View>

        <View style={styles.perTravelerRow}>
          <MaterialIcons
            name="person"
            size={14}
            color={theme.colors.onSurfaceVariant}
          />
          <Text
            style={[
              theme.typography.bodySm,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {formatINR(perTraveler)} per traveler
          </Text>
        </View>
      </View>

      {/* Categories */}
      <Text
        style={[
          theme.typography.labelSm,
          { color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' },
        ]}
      >
        Category split
      </Text>

      {trip.categories.map((category) => {
        const accent = accentColor(theme, CATEGORY_ACCENT[category.id] ?? category.color);
        const isPrepaid = category.prepaid >= category.amount && category.amount > 0;
        return (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={styles.categoryTitleRow}>
                <View style={[styles.dot, { backgroundColor: accent }]} />
                <Text
                  style={[
                    theme.typography.labelMd,
                    { color: theme.colors.secondary, fontWeight: '700' },
                  ]}
                >
                  {category.label}
                </Text>
              </View>
              <Text
                style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant }]}
              >
                {formatINR(category.amount)}
              </Text>
            </View>

            <Stepper
              label={category.label.toLowerCase()}
              value={category.amount}
              step={100}
              accentColor={accent}
              onChange={(value) => setCategoryAmount(category.id, value)}
            />

            <View style={styles.prepaidRow}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isPrepaid }}
                accessibilityLabel={`Mark ${category.label} as pre-paid`}
                onPress={() => toggleCategoryPrepaid(category.id)}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.checkbox,
                  isPrepaid && { backgroundColor: accent, borderColor: accent },
                  pressed && { opacity: 0.8 },
                ]}
              >
                {isPrepaid ? (
                  <MaterialIcons
                    name="check"
                    size={14}
                    color={theme.colors.onPrimary}
                  />
                ) : null}
              </Pressable>
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {isPrepaid ? 'Pre-paid in full' : 'Mark as pre-paid'}
              </Text>
              {category.prepaid > 0 && !isPrepaid ? (
                <Text
                  style={[
                    theme.typography.labelMd,
                    { color: theme.colors.primary },
                  ]}
                >
                  {formatINR(category.prepaid)} paid
                </Text>
              ) : null}
            </View>

            {!isPrepaid ? (
              <Stepper
                label={`${category.label.toLowerCase()} pre-paid`}
                value={category.prepaid}
                step={100}
                max={category.amount}
                accentColor={accent}
                onChange={(value) => setCategoryPrepaid(category.id, value)}
              />
            ) : null}
          </View>
        );
      })}
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
    progressFill: {
      height: '100%',
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.primary,
    },
    progressMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.xs,
    },
    totalStepperRow: {
      marginTop: theme.spacing.md,
    },
    perTravelerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    categoryCard: {
      padding: theme.spacing.md,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
      gap: theme.spacing.sm,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    categoryTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    prepaidRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: theme.colors.outline,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}