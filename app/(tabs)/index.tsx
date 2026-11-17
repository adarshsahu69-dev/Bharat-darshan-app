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

import { CategoryChip } from '@/components/CategoryChip';
import { EmptyState } from '@/components/EmptyState';
import { FeaturedCard } from '@/components/FeaturedCard';
import { PopularCard } from '@/components/PopularCard';
import { SafeImage } from '@/components/SafeImage';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import {
  CategoryId,
  featuredMonuments,
  filterMonuments,
  homeCategories,
  popularMonuments,
  travelerAvatar,
} from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [search, setSearch] = useState('');

  const featured = featuredMonuments[0] ?? popularMonuments[0];

  // One filtered list drives both the category chips and the search box.
  const results = useMemo(
    () =>
      filterMonuments({
        categoryId: activeCategory ?? undefined,
        search,
      }),
    [activeCategory, search],
  );

  const isFiltering = activeCategory !== null || search.trim().length > 0;
  const activeLabel =
    homeCategories.find((category) => category.id === activeCategory)?.label ??
    'All Sites';

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
              <EmptyState onAction={() => {
                setActiveCategory(null);
                setSearch('');
              }} />
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
                    1 / 4
                  </Text>
                }
              />
              <FeaturedCard
                monument={featured}
                onPress={() => router.push(`/monument/${featured.id}`)}
              />
            </View>

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
                {popularMonuments.map((monument) => (
                  <PopularCard
                    key={monument.id}
                    monument={monument}
                    onPress={() => router.push(`/monument/${monument.id}`)}
                  />
                ))}
              </ScrollView>
            </View>
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
          <Avatar />
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
              Namaste, Traveler
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

function Avatar() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [failed, setFailed] = useState(false);

  return (
    <View style={styles.avatar}>
      {failed ? (
        <View style={styles.avatarFallback}>
          <Text
            style={[
              theme.typography.titleMd,
              { color: theme.colors.onPrimary },
            ]}
          >
            A
          </Text>
        </View>
      ) : (
        <SafeImage
          uri={travelerAvatar}
          containerStyle={styles.avatarImage}
          resizeMode="cover"
          accessibilityLabel="Traveler avatar"
          iconName="person"
          iconSize={20}
        />
      )}
      <View style={styles.onlineDot} />
    </View>
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
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 2,
      borderColor: `${theme.colors.primary}4D`,
      padding: 2,
    },
    avatarImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    avatarFallback: {
      flex: 1,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    onlineDot: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.gold,
      borderWidth: 2,
      borderColor: theme.colors.surface,
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