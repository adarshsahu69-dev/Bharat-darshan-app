import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SafeImage } from '@/components/SafeImage';
import { Monument, MonumentDetail } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  monument: Monument;
  detail?: MonumentDetail;
  saved: boolean;
  topInset: number;
  onBack: () => void;
  onShare: () => void;
  onToggleSaved: () => void;
};

export function MonumentHero({
  monument,
  detail,
  saved,
  topInset,
  onBack,
  onShare,
  onToggleSaved,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.heroWrap}>
      <SafeImage
        uri={monument.image}
        containerStyle={styles.hero}
        contentFit="cover"
        accessibilityLabel={monument.name}
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

      <View style={[styles.heroBar, { top: topInset + 16 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
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
            onPress={onShare}
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
            accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark site'}
            accessibilityState={{ selected: saved }}
            onPress={onToggleSaved}
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
            <SafeImage
              uri={detail.galleryImage}
              width={56}
              height={56}
              containerStyle={styles.galleryThumb}
              contentFit="cover"
              accessibilityLabel={`${monument.name} gallery`}
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
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    heroWrap: {
      width: '100%',
      height: 320,
    },
    hero: {
      width: '100%',
      height: '100%',
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
  });
}
