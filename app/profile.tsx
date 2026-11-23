import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CONTACT_EMAIL } from '@/content/privacy';
import { useMonuments } from '@/data/useMonuments';
import { useBookmarkStore } from '@/store/bookmarkStore';
import {
  getInitials,
  MAX_DISPLAY_NAME_LENGTH,
  useProfileStore,
} from '@/store/profileStore';
import { useTripStore } from '@/store/tripStore';
import { useTheme } from '@/theme/ThemeProvider';

type RowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export default function ProfileScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();

  const displayName = useProfileStore((state) => state.displayName);
  const setDisplayName = useProfileStore((state) => state.setDisplayName);
  const savedIds = useBookmarkStore((state) => state.savedIds);
  const trip = useTripStore((state) => state.trip);
  const { data: monuments } = useMonuments();

  const [editOpen, setEditOpen] = useState(false);
  const [draftName, setDraftName] = useState(displayName);

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const statesExplored = useMemo(() => {
    const savedSet = new Set(savedIds);
    const states = new Set<string>();
    for (const monument of monuments ?? []) {
      if (savedSet.has(monument.id)) {
        states.add(monument.state);
      }
    }
    return states.size;
  }, [monuments, savedIds]);

  const tripsPlanned = trip.days.length > 0 ? 1 : 0;

  const openEdit = () => {
    setDraftName(displayName);
    setEditOpen(true);
  };

  const saveName = () => {
    const trimmed = draftName.trim().slice(0, MAX_DISPLAY_NAME_LENGTH);
    setDisplayName(trimmed.length > 0 ? trimmed : displayName);
    setEditOpen(false);
  };

  const openFeedback = () => {
    const subject = encodeURIComponent('Bharat Darshan feedback');
    const body = encodeURIComponent('Hi Bharat Darshan team,\n\n');
    Linking.openURL(
      `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`,
    ).catch(() => {
      /* Mail app unavailable. */
    });
  };

  const rows: RowProps[] = [
    {
      icon: 'settings',
      label: 'Settings',
      onPress: () => router.push('/settings'),
    },
    {
      icon: 'privacy-tip',
      label: 'Privacy Policy',
      onPress: () => router.push('/privacy'),
    },
    {
      icon: 'info-outline',
      label: 'About Bharat Darshan',
      onPress: () => router.push('/about'),
    },
    {
      icon: 'mail-outline',
      label: 'Send Feedback',
      onPress: openFeedback,
    },
  ];

  return (
    <View style={styles.root}>
      <ScreenHeader title="Profile" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text
              style={[theme.typography.headlineLg, { color: theme.colors.primary }]}
            >
              {initials}
            </Text>
          </View>
          <Text
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.secondary, marginTop: theme.spacing.md },
            ]}
          >
            {displayName}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit display name"
            onPress={openEdit}
            hitSlop={8}
            style={({ pressed }) => [
              styles.editButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <MaterialIcons name="edit" size={14} color={theme.colors.primary} />
            <Text
              style={[theme.typography.labelMd, { color: theme.colors.primary }]}
            >
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="Places Saved"
            value={String(savedIds.length)}
            icon="bookmark"
          />
          <StatCard
            label="Trips Planned"
            value={String(tripsPlanned)}
            icon="calendar-today"
          />
          <StatCard
            label="States Explored"
            value={String(statesExplored)}
            icon="map"
          />
        </View>

        <View style={styles.listCard}>
          {rows.map((row, index) => (
            <View key={row.label}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={row.accessibilityLabel ?? row.label}
                onPress={row.onPress}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { backgroundColor: theme.colors.surfaceContainerLow },
                ]}
              >
                <View style={styles.rowIcon}>
                  <MaterialIcons
                    name={row.icon}
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
                <Text
                  style={[
                    theme.typography.bodyMd,
                    { color: theme.colors.onSurface, flex: 1 },
                  ]}
                >
                  {row.label}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={theme.colors.outline}
                />
              </Pressable>
              {index < rows.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomSheet
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit name"
        subtitle="This name is shown on your Home screen."
        showCloseButton={false}
      >
        <View style={styles.field}>
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' },
            ]}
          >
            Display name
          </Text>
          <TextInput
            value={draftName}
            onChangeText={(text) =>
              setDraftName(text.slice(0, MAX_DISPLAY_NAME_LENGTH))
            }
            placeholder="Traveler"
            placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
            maxLength={MAX_DISPLAY_NAME_LENGTH}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={saveName}
            accessibilityLabel="Display name"
            style={[theme.typography.bodyMd, styles.input]}
          />
          <Text
            style={[
              theme.typography.bodySm,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {draftName.length}/{MAX_DISPLAY_NAME_LENGTH}
          </Text>
        </View>
        <View style={styles.sheetActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={() => setEditOpen(false)}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[theme.typography.labelMd, { color: theme.colors.secondary }]}
            >
              Cancel
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save display name"
            onPress={saveName}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text
              style={[theme.typography.labelMd, { color: theme.colors.onPrimary }]}
            >
              Save
            </Text>
          </Pressable>
        </View>
      </BottomSheet>
    </View>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <View style={styles.statCard}>
      <MaterialIcons name={icon} size={18} color={theme.colors.primary} />
      <Text
        style={[
          theme.typography.headlineSm,
          { color: theme.colors.secondary, marginTop: 6 },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          theme.typography.labelSm,
          {
            color: theme.colors.onSurfaceVariant,
            marginTop: 2,
            textAlign: 'center',
          },
        ]}
      >
        {label}
      </Text>
    </View>
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
      gap: theme.spacing.lg,
    },
    profileCard: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 2,
      borderColor: `${theme.colors.primary}33`,
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      minHeight: 36,
    },
    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    statCard: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    listCard: {
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: 14,
      minHeight: 52,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    divider: {
      height: 1,
      backgroundColor: `${theme.colors.outlineVariant}66`,
      marginLeft: 68,
    },
    field: {
      gap: theme.spacing.xs,
    },
    input: {
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}80`,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.onSurface,
      minHeight: 44,
    },
    sheetActions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    cancelButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    saveButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
  });
}
