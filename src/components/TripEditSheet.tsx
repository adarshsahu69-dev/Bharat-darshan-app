import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { useTheme } from '@/theme/ThemeProvider';
import { useTripStore } from '@/store/tripStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Edit the trip header: title, destination, start/end dates and traveler count.
 * Changes are applied to the store as the user types so the card behind the
 * sheet reflects them immediately.
 */
export function TripEditSheet({ visible, onClose }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const trip = useTripStore((state) => state.trip);
  const setTripTitle = useTripStore((state) => state.setTripTitle);
  const setTripDestination = useTripStore((state) => state.setTripDestination);
  const setTripDates = useTripStore((state) => state.setTripDates);
  const setTravelerCount = useTripStore((state) => state.setTravelerCount);

  const [title, setTitle] = useState(trip.title);
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [travelers, setTravelers] = useState(String(trip.travelerCount));

  const commit = () => {
    if (title.trim()) {
      setTripTitle(title.trim());
    }
    if (destination.trim()) {
      setTripDestination(destination.trim());
    }
    setTripDates(startDate, endDate);
    setTravelerCount(Number(travelers.replace(/[^0-9]/g, '')) || 1);
    onClose();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Edit trip"
      subtitle="Update the trip header"
    >
      <Field label="Trip title">
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Royal Heritage of Rajasthan"
          placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
          style={[theme.typography.bodyMd, styles.input]}
        />
      </Field>

      <Field label="Destination">
        <TextInput
          value={destination}
          onChangeText={setDestination}
          placeholder="Jaipur & Amer"
          placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
          style={[theme.typography.bodyMd, styles.input]}
        />
      </Field>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Field label="Start date">
            <TextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
              autoCapitalize="none"
              style={[theme.typography.bodyMd, styles.input]}
            />
          </Field>
        </View>
        <View style={{ flex: 1 }}>
          <Field label="End date">
            <TextInput
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
              autoCapitalize="none"
              style={[theme.typography.bodyMd, styles.input]}
            />
          </Field>
        </View>
      </View>

      <Field label="Travelers">
        <TextInput
          value={travelers}
          onChangeText={(text) => setTravelers(text.replace(/[^0-9]/g, ''))}
          placeholder="4"
          placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
          keyboardType="number-pad"
          style={[theme.typography.bodyMd, styles.input]}
        />
      </Field>

      <View style={styles.actions}>
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Dates use YYYY-MM-DD. The header shows a friendly summary.
        </Text>
        <View style={styles.buttonRow}>
          <ActionButton label="Cancel" onPress={onClose} />
          <ActionButton label="Save changes" primary onPress={commit} />
        </View>
      </View>
    </BottomSheet>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.xs }}>
      <Text
        style={[
          theme.typography.labelSm,
          { color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' },
        ]}
      >
        {label}
      </Text>
      {children}
    </View>
  );
}

function ActionButton({
  label,
  onPress,
  primary = false,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        primary ? styles.primaryButton : styles.secondaryButton,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text
        style={[
          theme.typography.labelMd,
          { color: primary ? theme.colors.onPrimary : theme.colors.secondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}80`,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      color: theme.colors.onSurface,
    },
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    actions: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.xs,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    primaryButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}