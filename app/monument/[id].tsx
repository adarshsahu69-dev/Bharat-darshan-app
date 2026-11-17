import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getMonument, getMonumentDetail, Monument } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

export default function MonumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const monumentId = typeof id === 'string' ? id : '';
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const monument = getMonument(monumentId);
  const detail = getMonumentDetail(monumentId);

  const [saved, setSaved] = useState(
    monument ? (monument.initiallySaved ?? false) : false,
  );

  if (!monument) {
    return (
      <View style={styles.missing}>
        <Text
          style={[
            theme.typography.headlineSm,
            { color: theme.colors.secondary },
          ]}
        >
          Monument not found
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && { opacity: 0.9 },
          ]}
        >
          <MaterialIcons
            name="arrow-back"
            size={18}
            color={theme.colors.onPrimary}
          />
          <Text
            style={[
              theme.typography.labelMd,
              { color: theme.colors.onPrimary },
            ]}
          >
            Back to Explore
          </Text>
        </Pressable>
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
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: monument.image }}
            style={styles.hero}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
          <LinearGradient
            colors={[
              `rgba(${theme.colors.blackScrim}, 0.6)`,
              `rgba(${theme.colors.blackScrim}, 0)`,
              theme.colors.background,
            ]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          <View style={[styles.heroBar, { top: insets.top + 16 }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              hitSlop={6}
              style={({ pressed }) => [
                styles.heroButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <MaterialIcons
                name="arrow-back"
                size={20}
                color={theme.colors.secondary}
              />
            </Pressable>

            <View style={styles.heroActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Share site"
                onPress={share}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.heroButton,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <MaterialIcons
                  name="ios-share"
                  size={18}
                  color={theme.colors.secondary}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  saved ? 'Remove bookmark' : 'Bookmark site'
                }
                accessibilityState={{ selected: saved }}
                onPress={() => setSaved((value) => !value)}
                hitSlop={6}
                style={({ pressed }) => [
                  styles.heroButton,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <MaterialIcons
                  name={saved ? 'bookmark' : 'bookmark-border'}
                  size={18}
                  color={saved ? theme.colors.primary : theme.colors.secondary}
                />
              </Pressable>
            </View>
          </View>

          <View style={styles.galleryRow}>
            <View style={styles.galleryLeft}>
              {detail?.galleryImage ? (
                <Image
                  source={{ uri: detail.galleryImage }}
                  style={styles.galleryThumb}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                />
              ) : null}
              <View style={styles.photoCounter}>
                <MaterialIcons
                  name="photo-library"
                  size={12}
                  color={theme.colors.onImage}
                />
                <Text
                  style={[
                    theme.typography.labelSm,
                    { color: theme.colors.onImage },
                  ]}
                >
                  {detail?.photoCount ?? '1 / 1 Photo'}
                </Text>
              </View>
            </View>

            {monument.isUnesco ? (
              <View style={styles.unescoBadge}>
                <MaterialIcons
                  name="verified"
                  size={12}
                  color={theme.colors.onGold}
                />
                <Text
                  style={[
                    theme.typography.labelSm,
                    { color: theme.colors.onGold },
                  ]}
                >
                  UNESCO World Heritage
                </Text>
              </View>
            ) : null}
          </View>
        </View>

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

      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom, theme.spacing.md) },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Get directions"
          onPress={openDirections}
          style={({ pressed }) => [
            styles.directionsButton,
            pressed && { opacity: 0.9 },
          ]}
        >
          <MaterialIcons
            name="directions"
            size={18}
            color={theme.colors.secondary}
          />
          <Text
            style={[
              theme.typography.labelMd,
              { color: theme.colors.secondary },
            ]}
          >
            Directions
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add to trip"
          onPress={() => router.push('/trips')}
          style={({ pressed }) => [
            styles.addToTripButton,
            pressed && { opacity: 0.92 },
          ]}
        >
          <MaterialIcons
            name="playlist-add"
            size={18}
            color={theme.colors.onPrimary}
          />
          <Text
            style={[
              theme.typography.labelMd,
              { color: theme.colors.onPrimary },
            ]}
          >
            Add to Trip
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function MonumentIntro({
  monument,
  detail,
}: {
  monument: Monument;
  detail: ReturnType<typeof getMonumentDetail>;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View>
      <Text
        style={[
          theme.typography.labelSm,
          { color: theme.colors.primary, textTransform: 'uppercase' },
        ]}
      >
        {detail?.dynasty ?? monument.eyebrow ?? monument.category}
      </Text>
      <Text
        style={[
          theme.typography.headlineLgMobile,
          { color: theme.colors.secondary, marginTop: 2 },
        ]}
      >
        {monument.name}
      </Text>
      <View style={styles.addressRow}>
        <MaterialIcons
          name="location-on"
          size={14}
          color={theme.colors.primary}
        />
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, flexShrink: 1 },
          ]}
        >
          {detail?.address ?? `${monument.city}, ${monument.state}`}
        </Text>
      </View>

      <View style={styles.ratingRow}>
        <View style={styles.ratingValueRow}>
          <MaterialIcons name="star" size={18} color={theme.colors.gold} />
          <Text
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.gold },
            ]}
          >
            {monument.rating.toFixed(1)}
          </Text>
        </View>
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          ({detail?.reviewCount ?? monument.reviewCount ?? 'reviews'})
        </Text>
        <Text style={{ color: theme.colors.outline }}>|</Text>
        <View style={styles.verifiedRow}>
          <MaterialIcons
            name="verified-user"
            size={14}
            color={theme.colors.emerald}
          />
          <Text
            style={[
              theme.typography.bodySm,
              { color: theme.colors.secondary, fontWeight: '600' },
            ]}
          >
            Verified Heritage
          </Text>
        </View>
      </View>
    </View>
  );
}

function QuickInfoRow({
  detail,
}: {
  detail: ReturnType<typeof getMonumentDetail>;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (!detail) {
    return null;
  }

  const items: {
    key: string;
    icon: 'schedule' | 'payments' | 'wb-sunny' | 'hourglass-top';
    label: string;
    value: string;
  }[] = [
    { key: 'timings', icon: 'schedule', label: 'Timings', value: detail.timings },
    { key: 'fee', icon: 'payments', label: 'Entry Fee', value: detail.entryFee },
    { key: 'best', icon: 'wb-sunny', label: 'Best Time', value: detail.bestTime },
    { key: 'duration', icon: 'hourglass-top', label: 'Duration', value: detail.duration },
  ];

  return (
    <View style={styles.quickRow}>
      {items.map((item) => (
        <View key={item.key} style={styles.quickCard}>
          <MaterialIcons
            name={item.icon}
            size={18}
            color={theme.colors.primary}
          />
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.onSurfaceVariant, marginTop: 4 },
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.secondary, marginTop: 2 },
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

const detailTabs = ['Overview', 'History & Lore', 'How to Reach', 'Nearby Places'];

function DetailTabs({
  detail,
}: {
  detail: ReturnType<typeof getMonumentDetail>;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [active, setActive] = useState(detailTabs[0]);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {detailTabs.map((tab) => {
          const selected = tab === active;
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab}
              onPress={() => setActive(tab)}
              style={[
                styles.tab,
                selected ? styles.tabActive : styles.tabInactive,
              ]}
            >
              <Text
                style={[
                  theme.typography.labelMd,
                  selected
                    ? { color: theme.colors.primary, fontWeight: '700' }
                    : { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {active === 'Overview' && detail ? (
        <View style={styles.panel}>
          <Text
            style={[
              theme.typography.bodyMd,
              { color: theme.colors.onSurfaceVariant, lineHeight: 22 },
            ]}
          >
            {detail.overview}
          </Text>

          <Text
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.secondary, marginTop: theme.spacing.lg },
            ]}
          >
            Key Highlights
          </Text>
          <View style={styles.highlights}>
            {detail.highlights.map((highlight) => (
              <View key={highlight.title} style={styles.highlight}>
                <MaterialIcons
                  name={highlight.icon}
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      theme.typography.labelMd,
                      { color: theme.colors.secondary, fontWeight: '700' },
                    ]}
                  >
                    {highlight.title}
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
                    {highlight.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.audioBanner}>
            <View style={styles.audioLeft}>
              <View style={styles.audioIcon}>
                <MaterialIcons
                  name="headphones"
                  size={22}
                  color={theme.colors.goldSoft}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    theme.typography.labelMd,
                    { color: theme.colors.onSecondary, fontWeight: '700' },
                  ]}
                >
                  {detail.audioTour.title}
                </Text>
                <Text
                  style={[
                    theme.typography.bodySm,
                    {
                      color: `${theme.colors.onSecondary}CC`,
                      marginTop: 2,
                    },
                  ]}
                >
                  {detail.audioTour.subtitle}
                </Text>
              </View>
            </View>
            <View style={styles.listenButton}>
              <Text
                style={[
                  theme.typography.labelSm,
                  { color: theme.colors.onPrimary },
                ]}
              >
                {detail.audioTour.price}
              </Text>
            </View>
          </View>
        </View>
      ) : active !== 'Overview' ? (
        <View style={styles.panel}>
          <Text
            style={[
              theme.typography.bodyMd,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {active === 'History & Lore'
              ? 'Amber Fort was founded by Raja Alan Singh in 967 CE and expanded by the Kachwaha rulers of Jaipur from the 16th century onward.'
              : active === 'How to Reach'
                ? 'Amber Fort is 11 km from Jaipur city centre. Public buses and taxis run from the Pink City, and the Sun Gate is the main visitor entrance.'
                : 'Nearby attractions include Jaigarh Fort, Nahargarh Fort, Jal Mahal and the old walled city of Amer.'}
          </Text>
        </View>
      ) : null}

      <ReviewsPreview detail={detail} />
    </View>
  );
}

function ReviewsPreview({
  detail,
}: {
  detail: ReturnType<typeof getMonumentDetail>;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (!detail) {
    return null;
  }

  return (
    <View style={styles.reviews}>
      <View style={styles.reviewHeader}>
        <Text
          style={[
            theme.typography.headlineSm,
            { color: theme.colors.secondary },
          ]}
        >
          Traveler Reviews
        </Text>
        <Text
          style={[
            theme.typography.labelMd,
            { color: theme.colors.primary, fontWeight: '600' },
          ]}
        >
          All 18k Reviews
        </Text>
      </View>

      <View style={styles.reviewCard}>
        <View style={styles.reviewTop}>
          <View style={styles.reviewIdentity}>
            <View style={styles.reviewAvatar}>
              <Text
                style={[
                  theme.typography.labelSm,
                  { color: theme.colors.onPrimary },
                ]}
              >
                {detail.review.initials}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  theme.typography.labelSm,
                  { color: theme.colors.secondary },
                ]}
              >
                {detail.review.name}
              </Text>
              <Text
                style={[
                  theme.typography.bodySm,
                  { color: theme.colors.outline },
                ]}
              >
                {detail.review.meta}
              </Text>
            </View>
          </View>

          <View style={styles.stars}>
            {Array.from({ length: detail.review.rating }).map((_, index) => (
              <MaterialIcons
                key={index}
                name="star"
                size={14}
                color={theme.colors.gold}
              />
            ))}
          </View>
        </View>

        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.sm },
          ]}
        >
          {detail.review.text}
        </Text>
      </View>
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
    heroWrap: {
      width: '100%',
      height: 320,
    },
    hero: {
      width: '100%',
      height: '100%',
    },
    content: {
      paddingHorizontal: theme.spacing.page,
      marginTop: -theme.radii.hero,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
    },
    heroBar: {
      position: 'absolute',
      top: 0,
      left: theme.spacing.page,
      right: theme.spacing.page,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    heroButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.surface}E6`,
      ...theme.shadows.warmSoft,
    },
    heroActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    galleryRow: {
      position: 'absolute',
      bottom: theme.spacing.md,
      left: theme.spacing.page,
      right: theme.spacing.page,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    galleryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    galleryThumb: {
      width: 56,
      height: 56,
      borderRadius: theme.radii.default,
      borderWidth: 2,
      borderColor: theme.colors.onImage,
    },
    photoCounter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 4,
      borderRadius: theme.radii.chip,
      backgroundColor: `rgba(${theme.colors.blackScrim}, 0.6)`,
    },
    unescoBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 4,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.goldContainer,
      ...theme.shadows.warmSoft,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      marginTop: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.outlineVariant}4D`,
    },
    ratingValueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    verifiedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    quickRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    quickCard: {
      flex: 1,
      padding: theme.spacing.sm,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
      alignItems: 'center',
    },
    tabRow: {
      gap: theme.spacing.lg,
      paddingRight: theme.spacing.page,
      marginTop: theme.spacing.lg,
    },
    tab: {
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 2,
    },
    tabActive: {
      borderBottomColor: theme.colors.primary,
    },
    tabInactive: {
      borderBottomColor: 'transparent',
    },
    panel: {
      paddingTop: theme.spacing.lg,
    },
    highlights: {
      marginTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    highlight: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainer,
    },
    audioBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.secondary,
      marginTop: theme.spacing.lg,
    },
    audioLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flex: 1,
    },
    audioIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.onSecondary}1A`,
    },
    listenButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
    },
    reviews: {
      marginTop: theme.spacing.xl,
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.md,
    },
    reviewCard: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
    },
    reviewTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    reviewIdentity: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    reviewAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    stars: {
      flexDirection: 'row',
      gap: 1,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
    directionsButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    addToTripButton: {
      flex: 1.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
    missing: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.lg,
      padding: theme.spacing.page,
    },
    primaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
    },
  });
}