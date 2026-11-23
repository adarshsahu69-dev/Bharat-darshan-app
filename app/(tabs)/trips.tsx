import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetEditSheet } from '@/components/BudgetEditSheet';
import { DayChipRow } from '@/components/DayChipRow';
import { DayNameSheet } from '@/components/DayNameSheet';
import { PlacePickerSheet } from '@/components/PlacePickerSheet';
import { ProfileAvatarButton } from '@/components/ProfileAvatarButton';
import { TripBudgetCard } from '@/components/TripBudgetCard';
import { TripEditSheet } from '@/components/TripEditSheet';
import { TripHeaderCard } from '@/components/TripHeaderCard';
import { TripStatCard } from '@/components/TripStatCard';
import { TripStopCard } from '@/components/TripStopCard';
import {
  dayMetaLabel,
  formatINR,
  formatTripDates,
  tripSitesCount,
  tripTravelerImages,
  tripUnescoCount,
  TripDay,
} from '@/data/trips';
import { computeTripBudgetFromTrip } from '@/lib/tripBudget';
import { useTheme } from '@/theme/ThemeProvider';
import { useTripStore } from '@/store/tripStore';

const stopTones = ['primary', 'secondary', 'gold'] as const;

export default function TripsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const trip = useTripStore((state) => state.trip);
  const addDay = useTripStore((state) => state.addDay);
  const renameDay = useTripStore((state) => state.renameDay);
  const removeDay = useTripStore((state) => state.removeDay);
  const addStopToDay = useTripStore((state) => state.addStopToDay);
  const removeStop = useTripStore((state) => state.removeStop);
  const moveStop = useTripStore((state) => state.moveStop);

  const [activeDayId, setActiveDayId] = useState(trip.days[0]?.id ?? '');
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [daySheet, setDaySheet] = useState<
    { mode: 'add' } | { mode: 'rename'; dayId: string } | null
  >(null);

  const activeDay =
    trip.days.find((day) => day.id === activeDayId) ?? trip.days[0];

  const travelers = tripTravelerImages
    .slice(0, Math.min(trip.travelerCount, tripTravelerImages.length))
    .map((image, index) => ({
      id: `traveler-${index + 1}`,
      name: `Traveler ${index + 1}`,
      image,
    }));

  const sitesCount = tripSitesCount(trip);
  const unescoCount = tripUnescoCount(trip);
  const budget = computeTripBudgetFromTrip(trip);

  const openAddDaySheet = () => {
    setDaySheet({ mode: 'add' });
  };

  const openRenameDaySheet = (dayId: string) => {
    setDaySheet({ mode: 'rename', dayId });
  };

  const handleDaySheetSave = (name: string) => {
    if (!daySheet) {
      return;
    }
    if (daySheet.mode === 'add') {
      const id = addDay(name);
      setActiveDayId(id);
    } else {
      renameDay(daySheet.dayId, name);
    }
    setDaySheet(null);
  };

  const handleDaySheetDelete = () => {
    if (!daySheet || daySheet.mode !== 'rename') {
      return;
    }
    const dayId = daySheet.dayId;
    const remaining = trip.days.filter((day) => day.id !== dayId);
    removeDay(dayId);
    if (activeDayId === dayId) {
      setActiveDayId(remaining[0]?.id ?? '');
    }
    setDaySheet(null);
  };

  const confirmRemoveDay = () => {
    if (!activeDay || trip.days.length <= 1) {
      return;
    }
    Alert.alert(
      'Remove day',
      `Remove ${activeDay.title} and its ${activeDay.stops.length} stop(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const remaining = trip.days.filter((day) => day.id !== activeDay.id);
            removeDay(activeDay.id);
            setActiveDayId(remaining[0]?.id ?? '');
          },
        },
      ],
    );
  };

  const daySheetTarget =
    daySheet?.mode === 'rename'
      ? trip.days.find((day) => day.id === daySheet.dayId) ?? null
      : null;
  const daySheetNumber =
    daySheet?.mode === 'add'
      ? trip.days.length + 1
      : daySheetTarget
        ? trip.days.findIndex((day) => day.id === daySheetTarget.id) + 1
        : 1;

  const confirmRemoveStop = (stopId: string, stopName: string) => {
    if (!activeDay) {
      return;
    }
    Alert.alert(
      'Remove stop',
      `Remove ${stopName} from ${activeDay.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeStop(activeDay.id, stopId),
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <View style={styles.header}>
          <Text
            style={[theme.typography.brand, { color: theme.colors.primary }]}
          >
            Bharat Darshan
          </Text>
          <ProfileAvatarButton size={36} />
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TripHeaderCard
          chip="Rajasthan Circuit"
          title={trip.title}
          subtitle={trip.destination}
          dates={formatTripDates(trip.startDate, trip.endDate)}
          confirmed="Confirmed Trip"
          travelers={travelers}
          extraCount={Math.max(0, trip.travelerCount - travelers.length)}
          onEdit={() => setEditOpen(true)}
        />

        <View style={styles.statRow}>
          <TripStatCard
            label="Sites to Visit"
            value={String(sitesCount)}
            detail={
              unescoCount > 0 ? `${unescoCount} UNESCO Sites` : 'Curated stops'
            }
            icon="location-on"
            tone="primary"
          />
          <TripStatCard
            label="Est. Budget"
            value={formatINR(budget.total)}
            detail={`${formatINR(budget.perTraveler)} / traveler`}
            icon="account-balance-wallet"
            tone="gold"
          />
        </View>

        <TripBudgetCard
          budget={budget}
          onPress={() => setBudgetOpen(true)}
        />

        <View>
          <View style={styles.itineraryHeader}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.labelSm,
                  {
                    color: theme.colors.primary,
                    textTransform: 'uppercase',
                  },
                ]}
              >
                Daily Itinerary
              </Text>
              <View style={styles.dayTitleRow}>
                <Text
                  numberOfLines={1}
                  style={[
                    theme.typography.headlineSm,
                    {
                      color: theme.colors.secondary,
                      marginTop: 2,
                      flexShrink: 1,
                    },
                  ]}
                >
                  {activeDay?.title ?? 'No days yet'}
                </Text>
                {activeDay ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Rename ${activeDay.title}`}
                    onPress={() => openRenameDaySheet(activeDay.id)}
                    hitSlop={8}
                    style={({ pressed }) => [
                      styles.editDayButton,
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <MaterialIcons
                      name="edit"
                      size={16}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                ) : null}
              </View>
              <Text
                style={[
                  theme.typography.bodySm,
                  {
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 2,
                  },
                ]}
              >
                {activeDay ? dayMetaLabel(activeDay) : 'Add a day to begin'}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add day"
              onPress={openAddDaySheet}
              hitSlop={6}
              style={({ pressed }) => [
                styles.addDayButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <MaterialIcons
                name="add"
                size={16}
                color={theme.colors.onPrimary}
              />
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.onPrimary },
                ]}
              >
                Add day
              </Text>
            </Pressable>
          </View>

          <DayChipRow
            days={trip.days}
            activeId={activeDay?.id ?? ''}
            onSelect={setActiveDayId}
            onLongPress={(day: TripDay) => openRenameDaySheet(day.id)}
          />

          {activeDay && trip.days.length > 1 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove active day"
              onPress={confirmRemoveDay}
              hitSlop={6}
              style={({ pressed }) => [
                styles.removeDayButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <MaterialIcons
                name="delete-sweep"
                size={14}
                color={theme.colors.error}
              />
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.error },
                ]}
              >
                Remove this day
              </Text>
            </Pressable>
          ) : null}

          <View style={styles.timeline}>
            {(activeDay?.stops ?? []).map((stop, index, arr) => (
              <View key={stop.id} style={styles.timelineEntry}>
                <TripStopCard
                  stop={stop}
                  index={index}
                  tone={stopTones[index % stopTones.length]}
                  canMoveUp={index > 0}
                  canMoveDown={index < arr.length - 1}
                  onMoveUp={() =>
                    activeDay && moveStop(activeDay.id, stop.id, -1)
                  }
                  onMoveDown={() =>
                    activeDay && moveStop(activeDay.id, stop.id, 1)
                  }
                  onRemove={() => confirmRemoveStop(stop.id, stop.name)}
                />
              </View>
            ))}

            {activeDay && activeDay.stops.length === 0 ? (
              <View style={styles.emptyDay}>
                <MaterialIcons
                  name="explore"
                  size={26}
                  color={theme.colors.outline}
                />
                <Text
                  style={[
                    theme.typography.bodySm,
                    {
                      color: theme.colors.onSurfaceVariant,
                      marginTop: theme.spacing.sm,
                    },
                  ]}
                >
                  No places on this day yet.
                </Text>
              </View>
            ) : null}
          </View>

          {activeDay ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add place to day"
              onPress={() => setPickerOpen(true)}
              style={({ pressed }) => [
                styles.addPlaceButton,
                pressed && { opacity: 0.9 },
              ]}
            >
              <MaterialIcons
                name="add-circle-outline"
                size={18}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  theme.typography.labelMd,
                  { color: theme.colors.primary, fontWeight: '700' },
                ]}
              >
                Add place to {activeDay.title}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      <BudgetEditSheet
        visible={budgetOpen}
        onClose={() => setBudgetOpen(false)}
      />
      <TripEditSheet visible={editOpen} onClose={() => setEditOpen(false)} />
      <PlacePickerSheet
        visible={pickerOpen}
        dayId={activeDay?.id ?? null}
        onClose={() => setPickerOpen(false)}
      />
      <DayNameSheet
        visible={daySheet !== null}
        mode={daySheet?.mode ?? 'add'}
        day={daySheetTarget}
        dayNumber={daySheetNumber}
        canDelete={trip.days.length > 1}
        onClose={() => setDaySheet(null)}
        onSave={handleDaySheetSave}
        onDelete={handleDaySheetDelete}
      />
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.outlineVariant}4D`,
    },
    content: {
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.section,
      gap: theme.spacing.xl,
    },
    statRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    itineraryHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    dayTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    editDayButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryContainer,
      marginTop: 2,
    },
    addDayButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
    },
    removeDayButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 4,
      marginTop: theme.spacing.sm,
    },
    timeline: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.lg,
      alignSelf: 'stretch',
    },
    timelineEntry: {
      width: '100%',
      alignSelf: 'stretch',
    },
    emptyDay: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    addPlaceButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      borderStyle: 'dashed',
      backgroundColor: theme.colors.primaryContainer,
    },
  });
}