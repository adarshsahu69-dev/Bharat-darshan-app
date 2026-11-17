import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DayChipRow } from '@/components/DayChipRow';
import { TripBudgetCard } from '@/components/TripBudgetCard';
import { TripHeaderCard } from '@/components/TripHeaderCard';
import { TripStatCard } from '@/components/TripStatCard';
import { TripStopCard } from '@/components/TripStopCard';
import {
  tripBudget,
  tripDays,
  tripHeader,
  tripStats,
  tripTravelerImages,
} from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

const stopTones = ['primary', 'secondary', 'gold'] as const;

export default function TripsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [activeDayId, setActiveDayId] = useState(tripDays[0].id);

  const activeDay =
    tripDays.find((day) => day.id === activeDayId) ?? tripDays[0];

  const travelers = tripTravelerImages.slice(0, 3).map((image, index) => ({
    id: `traveler-${index + 1}`,
    name: `Traveler ${index + 1}`,
    image,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <View style={styles.header}>
          <Text
            style={[
              theme.typography.brand,
              { color: theme.colors.primary },
            ]}
          >
            Bharat Darshan
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <TripHeaderCard
          chip={tripHeader.chip}
          title={tripHeader.title}
          subtitle={tripHeader.subtitle}
          dates={tripHeader.dates}
          confirmed={tripHeader.confirmed}
          travelers={travelers}
          extraCount={tripHeader.travelerCount - travelers.length}
        />

        <View style={styles.statRow}>
          <TripStatCard
            label={tripStats.sites.label}
            value={tripStats.sites.value}
            detail={tripStats.sites.detail}
            icon="location-on"
            tone="primary"
          />
          <TripStatCard
            label={tripStats.budget.label}
            value={tripStats.budget.value}
            detail={tripStats.budget.detail}
            icon="account-balance-wallet"
            tone="gold"
          />
        </View>

        <TripBudgetCard
          total={tripBudget.total}
          prepaid={tripBudget.prepaid}
          prepaidNote={tripBudget.prepaidNote}
          segments={tripBudget.segments}
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
              <Text
                style={[
                  theme.typography.headlineSm,
                  {
                    color: theme.colors.secondary,
                    marginTop: 2,
                  },
                ]}
              >
                {activeDay.title}
              </Text>
              <Text
                style={[
                  theme.typography.bodySm,
                  {
                    color: theme.colors.onSurfaceVariant,
                    marginTop: 2,
                  },
                ]}
              >
                {activeDay.meta}
              </Text>
            </View>
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              3 Days Planned
            </Text>
          </View>

          <DayChipRow
            days={tripDays}
            activeId={activeDay.id}
            onSelect={setActiveDayId}
          />

          <View style={styles.timeline}>
            {activeDay.stops.map((stop, index) => (
              <View key={stop.id} style={styles.timelineEntry}>
                <TripStopCard
                  stop={stop}
                  index={index}
                  tone={stopTones[index % stopTones.length]}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    header: {
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
    },
    timeline: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.lg,
    },
    timelineEntry: {
      flexDirection: 'row',
    },
  });
}