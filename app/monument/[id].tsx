import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddToTripSheet } from '@/components/AddToTripSheet';
import {
  DetailTabs,
  MonumentActionBar,
  MonumentHero,
  MonumentIntro,
  QuickInfoRow,
} from '@/components/monument';
import { getMonumentDetail } from '@/data/monuments';
import { useMonument } from '@/data/useMonuments';
import { selectIsSaved, useBookmarkStore } from '@/store/bookmarkStore';
import { useTheme } from '@/theme/ThemeProvider';

export default function MonumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const monumentId = typeof id === 'string' ? id : '';
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // React Query fetches the monument from Supabase. Rich detail content
  // (highlights, audio tour, reviews) comes from the seed file as a fallback
  // because those fields are not in the database schema.
  const { data: monument, isPending, isError, error, refetch } =
    useMonument(monumentId);
  const detail = getMonumentDetail(monumentId);

  const saved = useBookmarkStore(selectIsSaved(monumentId));
  const toggleSaved = useBookmarkStore((state) => state.toggleSaved);
  const [addOpen, setAddOpen] = useState(false);

  if (isPending) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || !monument) {
    return (
      <View style={styles.centered}>
        <Text
          style={[
            theme.typography.headlineSm,
            { color: theme.colors.secondary, textAlign: 'center' },
          ]}
        >
          {isError ? 'Could not load monument' : 'Monument not found'}
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
          {(error as Error)?.message ?? 'Please try again.'}
        </Text>
        <View style={styles.errorActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retry"
            onPress={() => refetch()}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.onPrimary },
              ]}
            >
              Retry
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.secondary },
              ]}
            >
              Back
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const openDirections = () => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${monument.lat},${monument.lng}`,
    ).catch(() => {
      /* Maps app unavailable on this platform. */
    });
  };

  const share = () => {
    Share.share({
      message: `${monument.name} — ${detail?.address ?? `${monument.city}, ${monument.state}`}\nhttps://www.google.com/maps/search/?api=1&query=${monument.lat},${monument.lng}`,
    }).catch(() => {
      /* Sharing is unavailable on this platform. */
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <MonumentHero
          monument={monument}
          detail={detail}
          saved={saved}
          topInset={insets.top}
          onBack={() => router.back()}
          onShare={share}
          onToggleSaved={() => toggleSaved(monumentId)}
        />

        <View style={styles.content}>
          <MonumentIntro monument={monument} detail={detail} />
          {detail ? (
            <>
              <QuickInfoRow detail={detail} />
              <DetailTabs detail={detail} />
            </>
          ) : null}
        </View>
      </ScrollView>

      <MonumentActionBar
        bottomInset={insets.bottom}
        onDirections={openDirections}
        onAddToTrip={() => setAddOpen(true)}
      />

      <AddToTripSheet
        visible={addOpen}
        monumentId={monumentId}
        monumentName={monument.name}
        onClose={() => setAddOpen(false)}
        onAdded={() => router.push('/trips')}
      />
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scroll: {
      paddingBottom: 96,
    },
    content: {
      paddingHorizontal: theme.spacing.page,
      marginTop: -theme.radii.hero,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.page,
      backgroundColor: theme.colors.background,
    },
    errorActions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      minHeight: 44,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      minHeight: 44,
    },
  });
}
