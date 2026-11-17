import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { SafeImage } from '@/components/SafeImage';
import { SearchBar } from '@/components/SearchBar';
import { filterMonuments } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';
import { useTripStore } from '@/store/tripStore';

type Props = {
  visible: boolean;
  dayId: string | null;
  onClose: () => void;
};

/**
 * Searchable picker over every catalogue monument. Tapping the + button appends
 * the monument to the selected day as a stop and adds its ticket to the budget.
 */
export function PlacePickerSheet({ visible, dayId, onClose }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [search, setSearch] = useState('');

  const days = useTripStore((state) => state.trip.days);
  const addStopToDay = useTripStore((state) => state.addStopToDay);

  const day = days.find((item) => item.id === dayId);
  const results = useMemo(() => filterMonuments({ search }), [search]);
  const existingIds = useMemo(
    () => new Set((day?.stops ?? []).map((stop) => stop.monumentId)),
    [day],
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Add a place"
      subtitle={day ? `Adding to ${day.title}` : 'Choose a day first'}
    >
      <SearchBar
        value={search}
        onChangeText={setSearch}
        onClear={search.length > 0 ? () => setSearch('') : undefined}
        showMic={false}
        placeholder="Search monuments, forts, temples..."
        accessibilityLabel="Search places to add"
      />

      {results.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons
            name="search-off"
            size={28}
            color={theme.colors.outline}
          />
          <Text
            style={[
              theme.typography.bodySm,
              { color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.sm },
            ]}
          >
            No places match “{search}”.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {results.map((monument) => {
            const added = existingIds.has(monument.id);
            const ticket =
              monument.ticketPrice > 0
                ? `₹${monument.ticketPrice}`
                : 'Free';
            return (
              <View key={monument.id} style={styles.row}>
                <SafeImage
                  uri={monument.image}
                  style={styles.thumb}
                  accessibilityLabel={monument.name}
                />
                <View style={styles.rowText}>
                  <Text
                    numberOfLines={1}
                    style={[
                      theme.typography.labelMd,
                      { color: theme.colors.secondary, fontWeight: '700' },
                    ]}
                  >
                    {monument.name}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      theme.typography.bodySm,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {monument.city}, {monument.state}
                  </Text>
                  <View style={styles.metaRow}>
                    <MaterialIcons
                      name="confirmation-number"
                      size={12}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        theme.typography.labelMd,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {ticket}
                    </Text>
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: added }}
                  accessibilityLabel={
                    added ? `${monument.name} already added` : `Add ${monument.name}`
                  }
                  disabled={added || !dayId}
                  onPress={() => {
                    if (dayId) {
                      addStopToDay(dayId, monument.id);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.addButton,
                    added && styles.addButtonAdded,
                    pressed && !added && { opacity: 0.8 },
                  ]}
                >
                  <MaterialIcons
                    name={added ? 'check' : 'add'}
                    size={18}
                    color={added ? theme.colors.onPrimary : theme.colors.onPrimary}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
    </BottomSheet>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    empty: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
      paddingHorizontal: theme.spacing.page,
    },
    list: {
      gap: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.sm,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
    },
    thumb: {
      width: 56,
      height: 56,
      borderRadius: theme.radii.sm,
    },
    rowText: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 2,
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    addButtonAdded: {
      backgroundColor: theme.colors.emerald,
    },
  });
}