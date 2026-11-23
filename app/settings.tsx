import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { ThemePreference, useSettingsStore } from '@/store/settingsStore';
import { useTripStore } from '@/store/tripStore';
import { useTheme } from '@/theme/ThemeProvider';

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const themePreference = useSettingsStore((state) => state.themePreference);
  const setThemePreference = useSettingsStore(
    (state) => state.setThemePreference,
  );
  const clearSaved = useBookmarkStore((state) => state.clearSaved);
  const resetTrip = useTripStore((state) => state.resetTrip);

  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

  const confirmClearSaved = () => {
    Alert.alert(
      'Clear saved places',
      'This will remove all saved places from this device. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => clearSaved(),
        },
      ],
    );
  };

  const confirmResetTrip = () => {
    Alert.alert(
      'Reset trip to default',
      'This will replace your current trip plan with the default itinerary. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetTrip(),
        },
      ],
    );
  };

  const handleClearImageCache = () => {
    Alert.alert(
      'Clear image cache',
      'Cached images will be removed from this device. They will be downloaded again when needed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear cache',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all([Image.clearDiskCache(), Image.clearMemoryCache()]);
              Alert.alert('Cache cleared', 'Image cache has been cleared.');
            } catch {
              Alert.alert('Could not clear cache', 'Please try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Settings" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.section}>
          <Text style={[theme.typography.labelSm, styles.sectionLabel]}>
            Appearance
          </Text>
          <View style={styles.card}>
            <View style={styles.themeRow}>
              <View style={styles.themeLabelWrap}>
                <MaterialIcons
                  name="dark-mode"
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      theme.typography.bodyMd,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Theme
                  </Text>
                  <Text
                    style={[
                      theme.typography.bodySm,
                      { color: theme.colors.onSurfaceVariant, marginTop: 1 },
                    ]}
                  >
                    System follows your phone setting
                  </Text>
                </View>
              </View>
              <View style={styles.segmented}>
                {THEME_OPTIONS.map((option) => {
                  const active = themePreference === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`${option.label} theme`}
                      onPress={() => setThemePreference(option.id)}
                      style={({ pressed }) => [
                        styles.segment,
                        active && styles.segmentActive,
                        pressed && { opacity: 0.85 },
                      ]}
                    >
                      <Text
                        style={[
                          theme.typography.labelMd,
                          {
                            color: active
                              ? theme.colors.onPrimary
                              : theme.colors.onSurfaceVariant,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.labelSm, styles.sectionLabel]}>
            Data
          </Text>
          <View style={styles.card}>
            <ActionRow
              icon="bookmark-remove"
              label="Clear saved places"
              description="Remove all bookmarked places from this device"
              destructive
              onPress={confirmClearSaved}
            />
            <View style={styles.divider} />
            <ActionRow
              icon="restart-alt"
              label="Reset trip to default"
              description="Restore the default itinerary"
              destructive
              onPress={confirmResetTrip}
            />
            <View style={styles.divider} />
            <ActionRow
              icon="image-not-supported"
              label="Clear image cache"
              description="Free storage used by cached images"
              onPress={handleClearImageCache}
            />
          </View>
        </View>

        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
          ]}
        >
          Bharat Darshan v{version}
        </Text>
      </ScrollView>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  description,
  destructive,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description: string;
  destructive?: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const color = destructive ? theme.colors.error : theme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionRow,
        pressed && { backgroundColor: theme.colors.surfaceContainer },
      ]}
    >
      <View style={[styles.actionIcon, destructive && styles.actionIconDestructive]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, marginTop: 1 },
          ]}
        >
          {description}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={theme.colors.outline} />
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.page,
      paddingBottom: theme.spacing.section,
      gap: theme.spacing.xl,
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionLabel: {
      color: theme.colors.primary,
      textTransform: 'uppercase',
      paddingHorizontal: theme.spacing.xs,
    },
    card: {
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      overflow: 'hidden',
    },
    themeRow: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    themeLabelWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    segmented: {
      flexDirection: 'row',
      padding: 3,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      gap: 2,
    },
    segment: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: theme.radii.chip,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
    },
    segmentActive: {
      backgroundColor: theme.colors.primary,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: 14,
      minHeight: 56,
    },
    actionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    actionIconDestructive: {
      backgroundColor: `${theme.colors.error}14`,
    },
    divider: {
      height: 1,
      backgroundColor: `${theme.colors.outlineVariant}66`,
      marginLeft: 68,
    },
  });
}
