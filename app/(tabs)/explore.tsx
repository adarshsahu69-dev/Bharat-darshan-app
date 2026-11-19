import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CategoryChip } from '@/components/CategoryChip';
import { EmptyState } from '@/components/EmptyState';
import { ExploreCard } from '@/components/ExploreCard';
import { SearchBar } from '@/components/SearchBar';
import { CategoryId, homeCategories } from '@/data/monuments';
import { filterMonumentList, useMonuments } from '@/data/useMonuments';
import { useTheme } from '@/theme/ThemeProvider';

export default function ExploreScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [activeState, setActiveState] = useState<string | null>(null);

  // React Query owns loading, caching and retry. We render loading/error/empty
  // states from its result so no manual fetch logic is needed here.
  const { data: monuments, isPending, isError, error, refetch } =
    useMonuments();

  const states = useMemo(
    () => Array.from(new Set((monuments ?? []).map((m) => m.state))).sort(),
    [monuments],
  );

  // One filtered list drives the chips, the state filter and the search box.
  const results = useMemo(
    () =>
      filterMonumentList(monuments ?? [], {
        categoryId: activeCategory ?? undefined,
        state: activeState,
        search,
      }),
    [monuments, activeCategory, activeState, search],
  );

  const hasFilters =
    activeCategory !== null || activeState !== null || search.trim().length > 0;

  const reset = () => {
    setActiveCategory(null);
    setActiveState(null);
    setSearch('');
  };

  if (isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text
          style={[
            theme.typography.bodyMd,
            { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
          ]}
        >
          {(error as Error)?.message ?? 'Failed to load heritage sites.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry loading heritage sites"
          onPress={() => refetch()}
          style={({ pressed }) => [
            styles.retryButton,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text
            style={[
              theme.typography.labelMdStrong,
              { color: theme.colors.onPrimary },
            ]}
          >
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

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
                onClear={search.length > 0 ? () => setSearch('') : undefined}
                showMic={false}
                compact
                placeholder="Search by name, state, dynasty..."
                accessibilityLabel="Search destinations"
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Toggle state filter"
              accessibilityState={{ selected: activeState !== null }}
              onPress={() =>
                setActiveState((current) =>
                  current === null ? (states[0] ?? null) : null,
                )
              }
              style={({ pressed }) => [
                styles.filterButton,
                activeState !== null && styles.filterButtonActive,
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
            {homeCategories.map((category) => (
              <CategoryChip
                key={category.id}
                label={category.label}
                icon={category.icon}
                tone={category.tone}
                active={activeCategory === category.id}
                onPress={() =>
                  setActiveCategory((current) =>
                    current === category.id ? null : category.id,
                  )
                }
              />
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: theme.spacing.sm,
              paddingTop: theme.spacing.xs,
              paddingRight: theme.spacing.page,
            }}
          >
            {states.map((state) => (
              <Pressable
                key={state}
                accessibilityRole="button"
                accessibilityState={{ selected: activeState === state }}
                accessibilityLabel={`Filter by ${state}`}
                onPress={() =>
                  setActiveState((current) =>
                    current === state ? null : state,
                  )
                }
                style={({ pressed }) => [
                  styles.stateChip,
                  activeState === state && styles.stateChipActive,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text
                  style={[
                    theme.typography.labelSm,
                    {
                      color:
                        activeState === state
                          ? theme.colors.onSecondary
                          : theme.colors.onSurface,
                    },
                  ]}
                >
                  {state}
                </Text>
              </Pressable>
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
              {results.length} heritage places
            </Text>{' '}
            found
          </Text>
          {hasFilters ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
              onPress={reset}
              hitSlop={8}
            >
              <Text
                style={[
                  theme.typography.labelMdStrong,
                  { color: theme.colors.primary },
                ]}
              >
                Clear all
              </Text>
            </Pressable>
          ) : (
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
          )}
        </View>

        {results.length === 0 ? (
          <EmptyState onAction={reset} />
        ) : (
          results.map((monument) => (
            <ExploreCard
              key={monument.id}
              monument={monument}
              onPress={() => router.push(`/monument/${monument.id}`)}
            />
          ))
        )}
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
      gap: theme.spacing.sm,
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
    filterButtonActive: {
      backgroundColor: theme.colors.secondary,
    },
    stateChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}80`,
    },
    stateChipActive: {
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.secondary,
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
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.page,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.md,
    },
    retryButton: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}