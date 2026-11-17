import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { formatDayDate } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';
import { useTripStore } from '@/store/tripStore';

type Props = {
  visible: boolean;
  monumentId: string;
  monumentName: string;
  onClose: () => void;
  /** Called after a stop is added so the caller can navigate to Trips. */
  onAdded?: (dayTitle: string) => void;
};

/**
 * Day picker used by "Add to Trip" on the monument details screen. Choosing a
 * day appends the monument as a stop (and adds its ticket to the budget).
 */
export function AddToTripSheet({
  visible,
  monumentId,
  monumentName,
  onClose,
  onAdded,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const days = useTripStore((state) => state.trip.days);
  const addStopToDay = useTripStore((state) => state.addStopToDay);

  const handleSelect = (dayId: string, dayTitle: string) => {
    addStopToDay(dayId, monumentId);
    onClose();
    onAdded?.(dayTitle);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Add to trip"
      subtitle={`Add ${monumentName} to a day`}
    >
      <View style={styles.list}>
        {days.map((day, index) => (
          <Pressable
            key={day.id}
            accessibilityRole="button"
            accessibilityLabel={`Add to day ${index + 1}, ${day.title}`}
            onPress={() => handleSelect(day.id, day.title)}
            style={({ pressed }) => [
              styles.row,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={styles.dayBadge}>
              <Text
                style={[
                  theme.typography.labelSm,
                  { color: theme.colors.onPrimary },
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.secondary, fontWeight: '700' },
                ]}
              >
                {day.title}
              </Text>
              <Text
                style={[
                  theme.typography.bodySm,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {formatDayDate(day.date)} · {day.stops.length}{' '}
                {day.stops.length === 1 ? 'place' : 'places'}
              </Text>
            </View>
            <MaterialIcons
              name="add-circle"
              size={22}
              color={theme.colors.primary}
            />
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    list: {
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
    },
    dayBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
  });
}