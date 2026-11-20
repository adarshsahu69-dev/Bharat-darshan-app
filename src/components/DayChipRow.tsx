import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { formatDayDate, TripDay } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  days: TripDay[];
  activeId: string;
  onSelect: (id: string) => void;
  onLongPress?: (day: TripDay) => void;
};

export function DayChipRow({ days, activeId, onSelect, onLongPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {days.map((day, index) => {
        const active = day.id === activeId;
        return (
          <Pressable
            key={day.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Day ${index + 1}, ${day.title}`}
            accessibilityHint="Long press to rename or delete this day"
            onPress={() => onSelect(day.id)}
            onLongPress={() => onLongPress?.(day)}
            delayLongPress={350}
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
              Day {index + 1}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
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
            <Text
              style={[
                theme.typography.labelSm,
                {
                  color: active
                    ? `${theme.colors.onPrimary}CC`
                    : theme.colors.outline,
                  marginTop: 1,
                },
              ]}
            >
              {formatDayDate(day.date)}
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
      minWidth: 92,
      maxWidth: 160,
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