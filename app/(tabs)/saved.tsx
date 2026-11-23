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

import { AddToTripSheet } from '@/components/AddToTripSheet';
import { ExploreCard } from '@/components/ExploreCard';
import { ProfileAvatarButton } from '@/components/ProfileAvatarButton';
import { CategoryId, Monument } from '@/data/monuments';
import { useMonuments } from '@/data/useMonuments';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { useTheme } from '@/theme/ThemeProvider';

type SavedCategory = 'all' | CategoryId;

const savedCategories: {
  id: SavedCategory;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}[] = [
  { id: 'all', label: 'All', icon: 'collections-bookmark' },
  { id: 'forts', label: 'Forts', icon: 'fort' },
  { id: 'temples', label: 'Temples', icon: 'temple-hindu' },
  { id: 'palaces', label: 'Palaces', icon: 'account-balance' },
  { id: 'museums', label: 'Museums', icon: 'museum' },
  { id: 'nature', label: 'Nature', icon: 'forest' },
];

export default function SavedScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();

  const savedIds = useBookmarkStore((state) => state.savedIds);
  const { data: monuments, isPending, isError, error, refetch } =
    useMonuments();

  const [activeCategory, setActiveCategory] = useState<SavedCategory>('all');
  const [tripTarget, setTripTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const savedSet = useMemo(() => new Set(savedIds), [savedIds]);

  const savedMonuments = useMemo(
    () => (monuments ?? []).filter((monument) => savedSet.has(monument.id)),
    [monuments, savedSet],
  );

  const filteredMonuments = useMemo(() => {
    if (activeCategory === 'all') {
      return savedMonuments;
    }
    return savedMonuments.filter((monument) =>
      monument.categories.includes(activeCategory),
    );
  }, [savedMonuments, activeCategory]);

  const savedCount = savedMonuments.length;
  const countLabel = `${savedCount} ${savedCount === 1 ? 'place' : 'places'} saved`;

  const openDetails = (monument: Monument) => {
    router.push(`/monument/${monument.id}`);
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
          {(error as Error)?.message ?? 'Failed to load saved places.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retry loading saved places"
          onPress={() => refetch()}
          style={({ pressed }) => [
            styles.primaryButton,
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
                Saved Places
              </Text>
              <Text
                style={[
                  theme.typography.bodySm,
                  { color: theme.colors.onSurfaceVariant, marginTop: 2 },
                ]}
              >
                {countLabel}
              </Text>
            </View>
            <ProfileAvatarButton size={36} />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {savedCategories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <Pressable
                  key={category.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Filter ${category.label}`}
                  onPress={() => setActiveCategory(category.id)}
                  style={({ pressed }) => [
                    styles.chip,
                    active ? styles.chipActive : styles.chipInactive,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <MaterialIcons
                    name={category.icon}
                    size={16}
                    color={
                      active ? theme.colors.onPrimary : theme.colors.primary
                    }
                  />
                  <Text
                    style={[
                      theme.typography.labelMd,
                      {
                        color: active
                          ? theme.colors.onPrimary
                          : theme.colors.onSurface,
                      },
                    ]}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>

      {savedCount === 0 ? (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyIcon}>
            <MaterialIcons
              name="bookmark-border"
              size={36}
              color={theme.colors.primary}
            />
          </View>
          <Text
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.secondary, textAlign: 'center' },
            ]}
          >
            Nothing saved yet
          </Text>
          <Text
            style={[
              theme.typography.bodyMd,
              {
                color: theme.colors.onSurfaceVariant,
                textAlign: 'center',
                marginTop: theme.spacing.xs,
              },
            ]}
          >
            Bookmark heritage places to keep them here for quick access.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore places"
            onPress={() => router.push('/explore')}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <MaterialIcons
              name="explore"
              size={18}
              color={theme.colors.onPrimary}
            />
            <Text
              style={[
                theme.typography.labelMdStrong,
                { color: theme.colors.onPrimary },
              ]}
            >
              Explore Places
            </Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {filteredMonuments.length === 0 ? (
            <View style={styles.filteredEmpty}>
              <Text
                style={[
                  theme.typography.bodyMd,
                  { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
                ]}
              >
                No saved places in this category.
              </Text>
            </View>
          ) : (
            filteredMonuments.map((monument) => (
              <ExploreCard
                key={monument.id}
                monument={monument}
                onPress={() => openDetails(monument)}
                showActions
                onAddToTrip={(selected) =>
                  setTripTarget({ id: selected.id, name: selected.name })
                }
              />
            ))
          )}
        </ScrollView>
      )}

      <AddToTripSheet
        visible={tripTarget !== null}
        monumentId={tripTarget?.id ?? ''}
        monumentName={tripTarget?.name ?? ''}
        onClose={() => setTripTarget(null)}
        onAdded={() => router.push('/trips')}
      />
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    header: {
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.outlineVariant}4D`,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },
    chipRow: {
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.md,
      paddingRight: theme.spacing.page,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      minHeight: 40,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
    chipInactive: {
      backgroundColor: theme.colors.surfaceContainer,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    content: {
      padding: theme.spacing.page,
      paddingBottom: theme.spacing.section,
      gap: theme.spacing.lg,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.page,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.md,
    },
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.page,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.sm,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
      marginBottom: theme.spacing.sm,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      minHeight: 44,
      ...theme.shadows.warmSoft,
    },
    filteredEmpty: {
      paddingVertical: theme.spacing.xl,
      alignItems: 'center',
    },
  });
}
