import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExploreCard } from '@/components/ExploreCard';
import { FilterChip } from '@/components/FilterChip';
import { SearchBar } from '@/components/SearchBar';
import { exploreFilters, exploreMonuments } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

export default function ExploreScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const [search, setSearch] = useState('Forts & Temples');
  const [activeFilter, setActiveFilter] = useState('state');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView
        edges={['top']}
        style={{ backgroundColor: theme.colors.surface }}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  theme.typography.headlineSm,
                  { color: theme.colors.secondary },
                ]}
              >
                Explore Destinations
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
                Over 4,000 national monuments &amp; sacred sites
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Map view"
              onPress={() => router.push('/map')}
              hitSlop={8}
              style={({ pressed }) => [
                styles.mapButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <MaterialIcons
                name="map"
                size={20}
                color={theme.colors.secondary}
              />
            </Pressable>
          </View>

          <View style={styles.searchRow}>
            <View style={{ flex: 1 }}>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                onClear={() => setSearch('')}
                showMic={false}
                compact
                placeholder="Search by state, dynasty, name..."
                accessibilityLabel="Search destinations"
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open filter settings"
              style={({ pressed }) => [
                styles.filterButton,
                pressed && { opacity: 0.9 },
              ]}
            >
              <MaterialIcons
                name="tune"
                size={20}
                color={theme.colors.onPrimary}
              />
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: theme.spacing.sm,
              paddingTop: theme.spacing.xs,
              paddingRight: theme.spacing.page,
            }}
          >
            {exploreFilters.map((filter) => (
              <FilterChip
                key={filter.id}
                label={filter.label}
                icon={filter.icon}
                iconTone={filter.iconTone}
                showChevron={filter.showChevron}
                active={activeFilter === filter.id}
                onPress={() => setActiveFilter(filter.id)}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: theme.spacing.page,
          paddingBottom: theme.spacing.section,
          gap: theme.spacing.lg,
        }}
      >
        <View style={styles.resultsHeader}>
          <Text
            style={[
              theme.typography.bodySmMedium,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            <Text
              style={[
                theme.typography.bodySmStrong,
                { color: theme.colors.secondary },
              ]}
            >
              24 heritage places
            </Text>{' '}
            found
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sort heritage places"
            hitSlop={8}
            style={({ pressed }) => [
              styles.sortControl,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text
              style={[
                theme.typography.labelMdStrong,
                { color: theme.colors.primary },
              ]}
            >
              Sort: Recommended
            </Text>
            <MaterialIcons
              name="swap-vert"
              size={14}
              color={theme.colors.primary}
            />
          </Pressable>
        </View>

        {exploreMonuments.map((monument) => (
          <ExploreCard
            key={monument.id}
            monument={monument}
            onPress={() => router.push(`/monument/${monument.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    header: {
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.outlineVariant}4D`,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    mapButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.secondaryContainer,
    },
    filterButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
    resultsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.xs,
    },
    sortControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
  });
}