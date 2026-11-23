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
import { FeaturedCard } from '@/components/FeaturedCard';
import { PopularCard } from '@/components/PopularCard';
import { ProfileAvatarButton } from '@/components/ProfileAvatarButton';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { CategoryId, homeCategories } from '@/data/monuments';
import { filterMonumentList, useMonuments } from '@/data/useMonuments';
import { useProfileStore } from '@/store/profileStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [search, setSearch] = useState('');

  const homeState = useSettingsStore((s) => s.homeState);

  // React Query owns loading, caching and retry. We render loading/error/empty
  // states from its result so no manual fetch logic is needed here.
  const { data: monuments, isPending, isError, error, refetch } =
    useMonuments();

  const featured = monuments?.[0];
  const popular = useMemo(() => {
    const all = monuments ?? [];
    if (!homeState) return all.slice(0, 4);
    const inHome = all.filter((m) => m.state === homeState);
    const others = all.filter((m) => m.state !== homeState);
    return [...inHome, ...others].slice(0, 4);
  }, [monuments, homeState]);

  // One filtered list drives both the category chips and the search box.
  const results = useMemo(
    () =>
      filterMonumentList(monuments ?? [], {
        categoryId: activeCategory ?? undefined,
        search,
      }),
    [monuments, activeCategory, search],
  );

  const isFiltering = activeCategory !== null || search.trim().length > 0;
  const activeLabel =
    homeCategories.find((category) => category.id === activeCategory)?.label ??
    'All Sites';

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
      <HomeHeader
        search={search}
        onSearchChange={setSearch}
        onClear={() => setSearch('')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.section }}
      >
        <View
          style={{
            paddingTop: theme.spacing.md,
            paddingLeft: theme.spacing.page,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 10,
              paddingRight: theme.spacing.page,
              paddingVertical: theme.spacing.xs,
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
        </View>

        {isFiltering ? (
          <View
            style={{
              paddingHorizontal: theme.spacing.page,
              marginTop: theme.spacing.lg,
            }}
          >
            <SectionHeader
              eyebrow="Filtered Results"
              title={search.trim() ? `Results for “${search.trim()}”` : activeLabel}
              right={
                <Text
                  style={[
                    theme.typography.labelMdStrong,
                    { color: theme.colors.primary },
                  ]}
                >
                  {results.length}
                </Text>
              }
            />

            {results.length === 0 ? (
              <EmptyState
                onAction={() => {
                  setActiveCategory(null);
                  setSearch('');
                }}
              />
            ) : (
              <View style={{ gap: theme.spacing.lg }}>
                {results.map((monument) => (
                  <PopularCard
                    key={monument.id}
                    monument={monument}
                    fullWidth
                    onPress={() => router.push(`/monument/${monument.id}`)}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            {featured ? (
              <View
                style={{
                  paddingHorizontal: theme.spacing.page,
                  marginTop: theme.spacing.xl,
                }}
              >
                <SectionHeader
                  eyebrow="Curated Discovery"
                  title="Featured Heritage Sites"
                  right={
                    <Text
                      style={[
                        theme.typography.labelMdStrong,
                        { color: theme.colors.primary },
                      ]}
                    >
                      1 / {Math.max(1, (monuments ?? []).length)}
                    </Text>
                  }
                />
                <FeaturedCard
                  monument={featured}
                  onPress={() => router.push(`/monument/${featured.id}`)}
                />
              </View>
            ) : (
              <View
                style={{
                  paddingHorizontal: theme.spacing.page,
                  marginTop: theme.spacing.xl,
                }}
              >
                <EmptyState />
              </View>
            )}

            {popular.length > 0 ? (
              <View
                style={{
                  paddingHorizontal: theme.spacing.page,
                  marginTop: theme.spacing.xl,
                }}
              >
                <SectionHeader
                  eyebrow="Nearby Wonders"
                  title="Popular Near You"
                  right={<SeeAll onPress={() => router.push('/explore')} />}
                />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    gap: theme.spacing.lg,
                    paddingRight: theme.spacing.page,
                    paddingVertical: theme.spacing.xs,
                  }}
                >
                  {popular.map((monument) => (
                    <PopularCard
                      key={monument.id}
                      monument={monument}
                      onPress={() => router.push(`/monument/${monument.id}`)}
                    />
                  ))}
                </ScrollView>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function HomeHeader({
  search,
  onSearchChange,
  onClear,
}: {
  search: string;
  onSearchChange: (text: string) => void;
  onClear: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const displayName = useProfileStore((state) => state.displayName);

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text
            style={[theme.typography.brand, { color: theme.colors.primary }]}
          >
            Bharat Darshan
          </Text>
        </View>

        <View style={styles.greetingRow}>
          <ProfileAvatarButton size={44} />
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
              Namaste, {displayName}
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
              Explore Incredible India
            </Text>
          </View>
          <NotificationButton />
        </View>

        <SearchBar
          value={search}
          onChangeText={onSearchChange}
          onClear={search.length > 0 ? onClear : undefined}
          placeholder="Search forts, temples, palaces, museums..."
          accessibilityLabel="Search monuments"
        />
      </View>
    </SafeAreaView>
  );
}



function NotificationButton() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Notifications"
      hitSlop={8}
      style={({ pressed }) => [
        styles.notificationButton,
        pressed && { opacity: 0.85 },
      ]}
    >
      <MaterialIcons
        name="notifications"
        size={20}
        color={theme.colors.onSurface}
      />
      <View style={styles.notificationDot} />
    </Pressable>
  );
}

function SeeAll({ onPress }: { onPress: () => void }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="See all popular sites"
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.7 }]}
    >
      <Text
        style={[
          theme.typography.labelMdStrong,
          { color: theme.colors.primary },
        ]}
      >
        See All
      </Text>
      <MaterialIcons
        name="chevron-right"
        size={14}
        color={theme.colors.primary}
      />
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    header: {
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.outlineVariant}4D`,
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
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    greetingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    notificationButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    notificationDot: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    seeAll: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
  });
}