import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SafeImage } from '@/components/SafeImage';
import { TripTraveler } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  chip: string;
  title: string;
  subtitle: string;
  dates: string;
  confirmed: string;
  travelers: TripTraveler[];
  extraCount: number;
  onShare?: () => void;
  onEdit?: () => void;
};

export function TripHeaderCard({
  chip,
  title,
  subtitle,
  dates,
  confirmed,
  travelers,
  extraCount,
  onShare,
  onEdit,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.chip}>
          <Text
            style={[theme.typography.labelSm, { color: theme.colors.primary }]}
          >
            {chip}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TripIconButton
            icon="ios-share"
            label="Share trip"
            onPress={onShare}
          />
          <TripIconButton icon="edit" label="Edit trip" onPress={onEdit} />
        </View>
      </View>

      <Text
        style={[
          theme.typography.headlineMd,
          { color: theme.colors.secondary, marginTop: theme.spacing.sm },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          theme.typography.bodyMd,
          { color: theme.colors.onSurfaceVariant, marginTop: 2 },
        ]}
      >
        {subtitle}
      </Text>

      <View style={styles.dateRow}>
        <MaterialIcons
          name="calendar-month"
          size={14}
          color={theme.colors.primary}
        />
        <Text
          style={[
            theme.typography.labelMdStrong,
            { color: theme.colors.onSurface },
          ]}
        >
          {dates}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.travelerRow}>
          <View style={styles.avatars}>
            {travelers.slice(0, 3).map((traveler, index) => (
              <View
                key={traveler.id}
                style={[
                  styles.avatar,
                  index > 0 && { marginLeft: -10 },
                  index === 2 && { zIndex: -1 },
                ]}
              >
                <SafeImage
                  uri={traveler.image}
                  width={30}
                  height={30}
                  containerStyle={styles.avatarImage}
                  contentFit="cover"
                  accessibilityLabel={traveler.name}
                  iconName="person"
                  iconSize={14}
                />
              </View>
            ))}
            {extraCount > 0 ? (
              <View
                style={[
                  styles.avatar,
                  styles.avatarMore,
                  { marginLeft: -10, zIndex: -2 },
                ]}
              >
                <Text
                  style={[
                    theme.typography.labelSm,
                    { color: theme.colors.onPrimary },
                  ]}
                >
                  +{extraCount}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.confirmed}>
          <MaterialIcons
            name="verified"
            size={12}
            color={theme.colors.onGold}
          />
          <Text
            style={[theme.typography.labelSm, { color: theme.colors.onGold }]}
          >
            {confirmed}
          </Text>
        </View>
      </View>
    </View>
  );
}

function TripIconButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.iconButton, pressed && { opacity: 0.7 }]}
    >
      <MaterialIcons name={icon} size={18} color={theme.colors.secondary} />
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      ...theme.shadows.warmSoft,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    chip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primaryContainer,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.outlineVariant}4D`,
    },
    travelerRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatars: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: theme.colors.surfaceContainerLow,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    avatarMore: {
      backgroundColor: theme.colors.primary,
    },
    confirmed: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.goldContainer,
    },
  });
}