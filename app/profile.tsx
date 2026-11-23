import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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

type ExploredState = {
  state: string;
  count: number;
};

export default function ProfileScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();

  const displayName = useProfileStore((s) => s.displayName);
  const photoUri = useProfileStore((s) => s.photoUri);
  const setDisplayName = useProfileStore((s) => s.setDisplayName);
  const setPhotoUri = useProfileStore((s) => s.setPhotoUri);
  const savedIds = useBookmarkStore((s) => s.savedIds);
  const trip = useTripStore((s) => s.trip);
  const { data: monuments } = useMonuments();

  const [editOpen, setEditOpen] = useState(false);
  const [statesOpen, setStatesOpen] = useState(false);
  const [draftName, setDraftName] = useState(displayName);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [photoUri]);

  const initials = useMemo(() => getInitials(displayName), [displayName]);

  const exploredStates = useMemo<ExploredState[]>(() => {
    const savedSet = new Set(savedIds);
    const tripMonumentIds = new Set<string>();
    for (const day of trip.days) {
      for (const stop of day.stops) {
        if (stop.monumentId) tripMonumentIds.add(stop.monumentId);
      }
    }
    const counts = new Map<string, number>();
    for (const monument of monuments ?? []) {
      if (savedSet.has(monument.id) || tripMonumentIds.has(monument.id)) {
        counts.set(monument.state, (counts.get(monument.state) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => a.state.localeCompare(b.state));
  }, [monuments, savedIds, trip.days]);

  const statesExplored = exploredStates.length;
  const tripsPlanned = trip.days.length > 0 ? 1 : 0;
  const showPhoto = Boolean(photoUri) && !imageError;

  const openEdit = () => {
    setDraftName(displayName);
    setEditOpen(true);
  };

  const saveName = () => {
    const trimmed = draftName.trim().slice(0, MAX_DISPLAY_NAME_LENGTH);
    setDisplayName(trimmed.length > 0 ? trimmed : displayName);
    setEditOpen(false);
  };

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      if (result.canceled || !result.assets[0]) return;
      const asset = result.assets[0];
      const baseDir = FileSystem.documentDirectory;
      if (!baseDir) return;
      const ext = asset.uri.split('.').pop()?.split('?')[0] || 'jpg';
      const safeExt = /^[a-zA-Z0-9]+$/.test(ext) ? ext.toLowerCase() : 'jpg';
      const dest = `${baseDir}profile-photo.${safeExt}`;
      // Remove previous profile photos with other extensions.
      const exts = ['jpg', 'jpeg', 'png', 'webp', 'heic', safeExt];
      await Promise.all(
        Array.from(new Set(exts)).map(async (e) => {
          const p = `${baseDir}profile-photo.${e}`;
          try {
            const info = await FileSystem.getInfoAsync(p);
            if (info.exists && p !== dest) await FileSystem.deleteAsync(p, { idempotent: true });
          } catch {
            /* ignore */
          }
        }),
      );
      await FileSystem.copyAsync({ from: asset.uri, to: dest });
      setPhotoUri(dest);
      setImageError(false);
    } catch {
      /* Picker/copy unavailable. */
    }
  };

  const removePhoto = async () => {
    const uri = photoUri;
    setPhotoUri(null);
    setImageError(false);
    if (uri) {
      try {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch {
        /* ignore */
      }
    }
  };

  const openFeedback = () => {
    const subject = encodeURIComponent('Bharat Darshan feedback');
    const body = encodeURIComponent('Hi Bharat Darshan team,\n\n');
    Linking.openURL(`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`).catch(() => {});
  };

  const openState = (state: string) => {
    setStatesOpen(false);
    router.push({ pathname: '/(tabs)/explore', params: { state } });
  };

  const rows: RowProps[] = [
    { icon: 'settings', label: 'Settings', onPress: () => router.push('/settings') },
    { icon: 'privacy-tip', label: 'Privacy Policy', onPress: () => router.push('/privacy') },
    { icon: 'info-outline', label: 'About Bharat Darshan', onPress: () => router.push('/about') },
    { icon: 'mail-outline', label: 'Send Feedback', onPress: openFeedback },
  ];

  return (
    <View style={styles.root}>
      <ScreenHeader title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile photo"
            onPress={openEdit}
            style={({ pressed }) => [styles.avatarPressable, pressed && { opacity: 0.85 }]}
          >
            <View style={styles.avatar}>
              {showPhoto ? (
                <Image
                  source={{ uri: photoUri as string }}
                  style={styles.avatarImage}
                  contentFit="cover"
                  onError={() => setImageError(true)}
                  transition={100}
                />
              ) : (
                <Text style={[theme.typography.headlineLg, { color: theme.colors.primary }]}>
                  {initials}
                </Text>
              )}
            </View>
            <View style={styles.avatarBadge}>
              <MaterialIcons name="photo-camera" size={14} color={theme.colors.onPrimary} />
            </View>
          </Pressable>
          <Text style={[theme.typography.headlineSm, { color: theme.colors.secondary, marginTop: theme.spacing.md }]}>
            {displayName}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit profile"
            onPress={openEdit}
            hitSlop={8}
            style={({ pressed }) => [styles.editButton, pressed && { opacity: 0.85 }]}
          >
            <MaterialIcons name="edit" size={14} color={theme.colors.primary} />
            <Text style={[theme.typography.labelMd, { color: theme.colors.primary }]}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            label="Places Saved"
            value={savedIds.length}
            hint="Save a place to start"
            icon="bookmark"
            onPress={() => router.push('/(tabs)/saved')}
          />
          <StatCard
            label="Trips Planned"
            value={tripsPlanned}
            hint="Plan a trip to start"
            icon="calendar-today"
            onPress={() => router.push('/(tabs)/trips')}
          />
          <StatCard
            label="States Explored"
            value={statesExplored}
            hint="Explore to start"
            icon="map"
            onPress={() => setStatesOpen(true)}
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
                  <MaterialIcons name={row.icon} size={20} color={theme.colors.primary} />
                </View>
                <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface, flex: 1 }]}>
                  {row.label}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.outline} />
              </Pressable>
              {index < rows.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomSheet
        visible={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        subtitle="Update your name and photo"
        showCloseButton={false}
      >
        <View style={styles.photoActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose photo from gallery"
            onPress={pickPhoto}
            style={({ pressed }) => [styles.photoActionBtn, pressed && { opacity: 0.85 }]}
          >
            <MaterialIcons name="photo-library" size={20} color={theme.colors.primary} />
            <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface, flex: 1 }]}>
              Choose from gallery
            </Text>
          </Pressable>
          {photoUri ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove photo"
              onPress={removePhoto}
              style={({ pressed }) => [styles.photoActionBtn, pressed && { opacity: 0.85 }]}
            >
              <MaterialIcons name="delete-outline" size={20} color={theme.colors.error} />
              <Text style={[theme.typography.bodyMd, { color: theme.colors.error, flex: 1 }]}>
                Remove photo
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={[theme.typography.labelSm, { color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' }]}>
            Display name
          </Text>
          <TextInput
            value={draftName}
            onChangeText={(text) => setDraftName(text.slice(0, MAX_DISPLAY_NAME_LENGTH))}
            placeholder="Traveler"
            placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
            maxLength={MAX_DISPLAY_NAME_LENGTH}
            returnKeyType="done"
            onSubmitEditing={saveName}
            accessibilityLabel="Display name"
            style={[theme.typography.bodyMd, styles.input]}
          />
          <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant }]}>
            {draftName.length}/{MAX_DISPLAY_NAME_LENGTH}
          </Text>
        </View>
        <View style={styles.sheetActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={() => setEditOpen(false)}
            style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={[theme.typography.labelMd, { color: theme.colors.secondary }]}>Cancel</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save display name"
            onPress={saveName}
            style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.9 }]}
          >
            <Text style={[theme.typography.labelMd, { color: theme.colors.onPrimary }]}>Save</Text>
          </Pressable>
        </View>
      </BottomSheet>

      <BottomSheet
        visible={statesOpen}
        onClose={() => setStatesOpen(false)}
        title="States explored"
        subtitle="From places you saved or added to trips"
      >
        {exploredStates.length === 0 ? (
          <View style={styles.emptyStates}>
            <MaterialIcons name="explore" size={32} color={theme.colors.outline} />
            <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: theme.spacing.sm }]}>
              No states explored yet.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Explore places"
              onPress={() => {
                setStatesOpen(false);
                router.push('/(tabs)/explore');
              }}
              style={({ pressed }) => [styles.exploreBtn, pressed && { opacity: 0.9 }]}
            >
              <Text style={[theme.typography.labelMd, { color: theme.colors.onPrimary }]}>Explore Places</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.stateList}>
            {exploredStates.map((item) => (
              <Pressable
                key={item.state}
                accessibilityRole="button"
                accessibilityLabel={`${item.state}, ${item.count} places`}
                onPress={() => openState(item.state)}
                style={({ pressed }) => [
                  styles.stateRow,
                  pressed && { backgroundColor: theme.colors.surfaceContainerLow },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}>{item.state}</Text>
                  <Text style={[theme.typography.bodySm, { color: theme.colors.onSurfaceVariant, marginTop: 1 }]}>
                    {item.count} {item.count === 1 ? 'place' : 'places'}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={theme.colors.outline} />
              </Pressable>
            ))}
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
  onPress,
}: {
  label: string;
  value: number;
  hint: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const isEmpty = value === 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      style={({ pressed }) => [styles.statCard, pressed && { opacity: 0.85 }]}
    >
      <MaterialIcons name={icon} size={18} color={theme.colors.primary} />
      <Text style={[theme.typography.headlineSm, { color: theme.colors.secondary, marginTop: 6 }]}>
        {value}
      </Text>
      <Text
        style={[
          theme.typography.labelSm,
          { color: theme.colors.onSurfaceVariant, marginTop: 2, textAlign: 'center' },
        ]}
      >
        {label}
      </Text>
      {isEmpty ? (
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.outline, marginTop: 4, textAlign: 'center', fontSize: 10, lineHeight: 13 },
          ]}
        >
          {hint}
        </Text>
      ) : null}
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.page, paddingBottom: theme.spacing.section, gap: theme.spacing.lg },
    profileCard: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    avatarPressable: { position: 'relative' },
    avatar: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 2,
      borderColor: `${theme.colors.primary}33`,
      overflow: 'hidden',
    },
    avatarImage: { width: 88, height: 88 },
    avatarBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.surfaceContainerLow,
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
    statsRow: { flexDirection: 'row', gap: theme.spacing.sm },
    statCard: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      minHeight: 110,
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
    divider: { height: 1, backgroundColor: `${theme.colors.outlineVariant}66`, marginLeft: 68 },
    photoActions: {
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    photoActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    field: { gap: theme.spacing.xs },
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
    sheetActions: { flexDirection: 'row', gap: theme.spacing.md },
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
    emptyStates: { alignItems: 'center', paddingVertical: theme.spacing.lg },
    exploreBtn: {
      marginTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      minHeight: 44,
      justifyContent: 'center',
    },
    stateList: { gap: 2 },
    stateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radii.default,
      minHeight: 52,
    },
  });
}
