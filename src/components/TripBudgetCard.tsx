import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TripBudgetCategory } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  total: number;
  prepaid: number;
  perTraveler: number;
  categories: TripBudgetCategory[];
  onPress?: () => void;
};

function accentFor(
  theme: ReturnType<typeof useTheme>,
  tone: TripBudgetCategory['color'],
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

function inr(value: number): string {
  const digits = String(Math.max(0, Math.round(value)));
  if (digits.length <= 3) {
    return `₹${digits}`;
  }
  const lastThree = digits.slice(-3);
  let rest = digits.slice(0, -3);
  const groups: string[] = [];
  while (rest.length > 2) {
    groups.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest.length > 0) {
    groups.unshift(rest);
  }
  return `₹${groups.join(',')},${lastThree}`;
}

export function TripBudgetCard({
  total,
  prepaid,
  perTraveler,
  categories,
  onPress,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const totalWeight = categories.reduce((sum, c) => sum + c.amount, 0) || 1;
  const progress = total > 0 ? Math.min(1, prepaid / total) : 0;

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
            {inr(total)}
          </Text>
        </View>
        <View style={styles.prepaidWrap}>
          <Text
            style={[
              theme.typography.bodySmStrong,
              { color: theme.colors.primary },
            ]}
          >
            {inr(prepaid)}
          </Text>
          <Text
            style={[
              theme.typography.labelMd,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            of {inr(total)} pre-paid
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
        {categories.map((category) => (
          <View
            key={category.id}
            style={[
              styles.segment,
              {
                flex: category.amount / totalWeight,
                backgroundColor: accentFor(theme, category.color),
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.round(progress * 100)}%` },
          ]}
        />
      </View>

      <View style={styles.legend}>
        {categories.map((category) => (
          <View key={category.id} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: accentFor(theme, category.color) },
              ]}
            />
            <View>
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {category.label}
              </Text>
              <Text
                style={[
                  theme.typography.bodySmStrong,
                  { color: theme.colors.secondary },
                ]}
              >
                {inr(category.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <MaterialIcons
          name="person"
          size={12}
          color={theme.colors.onSurfaceVariant}
        />
        <Text
          style={[
            theme.typography.labelMd,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          {inr(perTraveler)} / traveler
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
    progressTrack: {
      height: 4,
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.surfaceContainerHigh,
      overflow: 'hidden',
      marginTop: theme.spacing.xs,
    },
    progressFill: {
      height: '100%',
      borderRadius: theme.radii.full,
      backgroundColor: theme.colors.primary,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
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