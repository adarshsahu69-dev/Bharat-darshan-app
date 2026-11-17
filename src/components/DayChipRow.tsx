import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { TripDay } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  days: TripDay[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function DayChipRow({ days, activeId, onSelect }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {days.map((day) => {
        const active = day.id === activeId;
        return (
          <Pressable
            key={day.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${day.shortLabel}, ${day.title}`}
            onPress={() => onSelect(day.id)}
            style={({ pressed }) => [
              styles.chip,
              active ? styles.chipActive : styles.chipInactive,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[
                theme.typography.labelMd,
                { color: active ? theme.colors.onPrimary : theme.colors.onSurface },
              ]}
            >
              {day.shortLabel}
            </Text>
            <Text
              style={[
                theme.typography.labelSm,
                {
                  color: active
                    ? theme.colors.onPrimary
                    : theme.colors.onSurfaceVariant,
                  marginTop: 1,
                },
              ]}
            >
              {day.title}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    row: {
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      paddingRight: theme.spacing.page,
    },
    chip: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.chip,
      borderWidth: 1,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
    chipInactive: {
      backgroundColor: theme.colors.surfaceContainer,
      borderColor: `${theme.colors.outlineVariant}80`,
    },
  });
}