import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { ScreenHeader } from '@/components/ScreenHeader';
import { APP_SHARE_URL } from '@/content/app';
import { CONTACT_EMAIL } from '@/content/privacy';
import { useMonuments } from '@/data/useMonuments';
import { useBookmarkStore } from '@/store/bookmarkStore';
import {
  MAX_TRAVELERS,
  MIN_TRAVELERS,
  ThemePreference,
  useSettingsStore,
} from '@/store/settingsStore';
import { useTripStore } from '@/store/tripStore';
import { useTheme } from '@/theme/ThemeProvider';

const THEME_OPTIONS: { id: ThemePreference; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'system', label: 'System' },
];

function themeHelper(pref: ThemePreference): string {
  if (pref === 'light') return 'Always light';
  if (pref === 'dark') return 'Always dark';
  return 'Follows your phone setting';
}

export default function SettingsScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const { data: monuments } = useMonuments();

  const themePreference = useSettingsStore((s) => s.themePreference);
  const homeState = useSettingsStore((s) => s.homeState);
  const defaultTravelers = useSettingsStore((s) => s.defaultTravelers);
  const setThemePreference = useSettingsStore((s) => s.setThemePreference);
  const setHomeState = useSettingsStore((s) => s.setHomeState);
  const setDefaultTravelers = useSettingsStore((s) => s.setDefaultTravelers);
  const clearSaved = useBookmarkStore((s) => s.clearSaved);
  const resetTrip = useTripStore((s) => s.resetTrip);

  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [statePickerOpen, setStatePickerOpen] = useState(false);

  const states = useMemo(
    () => Array.from(new Set((monuments ?? []).map((m) => m.state))).sort(),
    [monuments],
  );

  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

  const shareApp = async () => {
    try {
      await Share.share({
        message: `Discover India's heritage with Bharat Darshan. Explore forts, temples, palaces and more: ${APP_SHARE_URL}`,
      });
    } catch {
      /* share dismissed/unavailable */
    }
  };

  const sendFeedback = () => {
    const subject = encodeURIComponent('Bharat Darshan feedback');
    const body = encodeURIComponent('Hi Bharat Darshan team,\n\n');
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`).catch(() => {
      Alert.alert('Unable to open mail', `Please email us at ${CONTACT_EMAIL}.`);
    });
  };

  const confirmClearSaved = () => {
    Alert.alert(
      'Clear saved places',
      'This will remove all saved places from this device. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => clearSaved() },
      ],
    );
  };

  const confirmResetTrip = () => {
    Alert.alert(
      'Reset trip to default',
      'This will replace your current trip plan with the default itinerary. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => resetTrip() },
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Section title="Appearance">
          <View style={styles.card}>
            <View style={styles.themeRow}>
              <View style={styles.themeLabelWrap}>
                <MaterialIcons name="dark-mode" size={20} color={theme.colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}>Theme</Text>
                  <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant, marginTop: 1 }]}>
                    {themeHelper(themePreference)}
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
                          { color: active ? theme.colors.onPrimary : theme.colors.onSurfaceVariant },
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
        </Section>

        <Section title="Travel preferences">
          <View style={styles.card}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select home state"
              onPress={() => setStatePickerOpen(true)}
              style={({ pressed }) => [styles.actionRow, pressed && { backgroundColor: theme.colors.surfaceContainer }]}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons name="place" size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}>Home state</Text>
                <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant, marginTop: 1 }]}>
                  {homeState ?? 'Optional — show nearby monuments first'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={theme.colors.outline} />
            </Pressable>
            <View style={styles.divider} />
            <View style={styles.stepperRow}>
              <View style={styles.actionIcon}>
                <MaterialIcons name="group" size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}>Default travelers</Text>
                <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant, marginTop: 1 }]}>
                  Used for new trips
                </Text>
              </View>
              <View style={styles.stepper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Decrease default travelers"
                  onPress={() => setDefaultTravelers(defaultTravelers - 1)}
                  disabled={defaultTravelers <= MIN_TRAVELERS}
                  style={({ pressed }) => [
                    styles.stepBtn,
                    defaultTravelers <= MIN_TRAVELERS && styles.stepBtnDisabled,
                    pressed && defaultTravelers > MIN_TRAVELERS && { opacity: 0.8 },
                  ]}
                >
                  <MaterialIcons
                    name="remove"
                    size={18}
                    color={defaultTravelers <= MIN_TRAVELERS ? theme.colors.outline : theme.colors.primary}
                  />
                </Pressable>
                <Text style={[theme.typography.titleMd, { color: theme.colors.secondary, minWidth: 28, textAlign: 'center' }]}>
                  {defaultTravelers}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Increase default travelers"
                  onPress={() => setDefaultTravelers(defaultTravelers + 1)}
                  disabled={defaultTravelers >= MAX_TRAVELERS}
                  style={({ pressed }) => [
                    styles.stepBtn,
                    defaultTravelers >= MAX_TRAVELERS && styles.stepBtnDisabled,
                    pressed && defaultTravelers < MAX_TRAVELERS && { opacity: 0.8 },
                  ]}
                >
                  <MaterialIcons
                    name="add"
                    size={18}
                    color={defaultTravelers >= MAX_TRAVELERS ? theme.colors.outline : theme.colors.primary}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Section>

        <Section title="Support">
          <View style={styles.card}>
            <ActionRow icon="share" label="Share app" description="Tell others about Bharat Darshan" onPress={shareApp} />
            <View style={styles.divider} />
            <ActionRow icon="mail-outline" label="Send Feedback" description={`Email us at ${CONTACT_EMAIL}`} onPress={sendFeedback} />
            <View style={styles.divider} />
            <ActionRow icon="privacy-tip" label="Privacy Policy" description="How we handle your data" onPress={() => router.push('/privacy')} />
            <View style={styles.divider} />
            <ActionRow icon="info-outline" label="About Bharat Darshan" description="App info, credits and sources" onPress={() => router.push('/about')} />
          </View>
        </Section>

        <Section title="Advanced">
          <View style={styles.card}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={advancedOpen ? 'Collapse advanced settings' : 'Expand advanced settings'}
              onPress={() => setAdvancedOpen((v) => !v)}
              style={({ pressed }) => [styles.actionRow, pressed && { backgroundColor: theme.colors.surfaceContainer }]}
            >
              <View style={styles.actionIcon}>
                <MaterialIcons name="tune" size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}>Advanced options</Text>
                <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant, marginTop: 1 }]}>
                  Cache and data controls
                </Text>
              </View>
              <MaterialIcons name={advancedOpen ? 'expand-less' : 'expand-more'} size={22} color={theme.colors.outline} />
            </Pressable>
            {advancedOpen ? (
              <>
                <View style={styles.divider} />
                <ActionRow
                  icon="image-not-supported"
                  label="Clear image cache"
                  description="Free storage used by cached images"
                  destructive
                  onPress={handleClearImageCache}
                />
                <View style={styles.divider} />
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
              </>
            ) : null}
          </View>
        </Section>

        <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant, textAlign: 'center' }]}>
          Bharat Darshan v{version}
        </Text>
      </ScrollView>

      <BottomSheet
        visible={statePickerOpen}
        onClose={() => setStatePickerOpen(false)}
        title="Home state"
        subtitle="Pick a state to see its monuments first on Home"
      >
        <View style={styles.stateList}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: homeState === null }}
            onPress={() => {
              setHomeState(null);
              setStatePickerOpen(false);
            }}
            style={({ pressed }) => [styles.stateRow, pressed && { opacity: 0.85 }]}
          >
            <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface, flex: 1 }]}>None</Text>
            {homeState === null ? <MaterialIcons name="check" size={20} color={theme.colors.primary} /> : null}
          </Pressable>
          {states.map((s) => (
            <Pressable
              key={s}
              accessibilityRole="button"
              accessibilityState={{ selected: homeState === s }}
              onPress={() => {
                setHomeState(s);
                setStatePickerOpen(false);
              }}
              style={({ pressed }) => [styles.stateRow, pressed && { opacity: 0.85 }]}
            >
              <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface, flex: 1 }]}>{s}</Text>
              {homeState === s ? <MaterialIcons name="check" size={20} color={theme.colors.primary} /> : null}
            </Pressable>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.section}>
      <Text style={[theme.typography.labelSm, styles.sectionLabel]}>{title}</Text>
      {children}
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
      style={({ pressed }) => [styles.actionRow, pressed && { backgroundColor: theme.colors.surfaceContainer }]}
    >
      <View style={[styles.actionIcon, destructive && styles.actionIconDestructive]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[theme.typography.bodyMd, { color: destructive ? theme.colors.error : theme.colors.onSurface }]}>
          {label}
        </Text>
        <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant, marginTop: 1 }]}>
          {description}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={theme.colors.outline} />
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.page, paddingBottom: theme.spacing.section, gap: theme.spacing.xl },
    section: { gap: theme.spacing.sm },
    sectionLabel: { color: theme.colors.primary, textTransform: 'uppercase', paddingHorizontal: theme.spacing.xs },
    card: {
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      overflow: 'hidden',
    },
    themeRow: { padding: theme.spacing.lg, gap: theme.spacing.md },
    themeLabelWrap: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
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
    segmentActive: { backgroundColor: theme.colors.primary },
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
    actionIconDestructive: { backgroundColor: `${theme.colors.error}14` },
    divider: { height: 1, backgroundColor: `${theme.colors.outlineVariant}66`, marginLeft: 68 },
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: 14,
      minHeight: 56,
    },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
    stepBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    stepBtnDisabled: { opacity: 0.45 },
    stateList: { gap: 2 },
    stateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radii.default,
      minHeight: 48,
    },
  });
}
