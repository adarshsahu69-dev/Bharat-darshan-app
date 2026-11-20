import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { TripDay } from '@/data/trips';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  visible: boolean;
  mode: 'add' | 'rename';
  day?: TripDay | null;
  /** 1-based day number used for fallback name and labels. */
  dayNumber: number;
  canDelete: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onDelete?: () => void;
};

const MAX_LENGTH = 40;

/**
 * Bottom sheet for adding or renaming a trip day. In rename mode it also offers
 * deleting the day (with confirmation), disabled when only one day remains.
 */
export function DayNameSheet({
  visible,
  mode,
  day,
  dayNumber,
  canDelete,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [name, setName] = useState('');

  const isRename = mode === 'rename';

  useEffect(() => {
    if (!visible) {
      return;
    }
    setName(isRename ? (day?.title ?? '') : '');
  }, [visible, isRename, day?.id, day?.title]);

  const fallbackName = `Day ${dayNumber}`;

  const handleSave = () => {
    const trimmed = name.trim();
    onSave(trimmed.length > 0 ? trimmed : fallbackName);
  };

  const handleDelete = () => {
    if (!canDelete || !day) {
      return;
    }
    Alert.alert(
      'Delete day',
      `Delete ${day.title} and its ${day.stops.length} stop(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete?.();
          },
        },
      ],
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={isRename ? 'Rename day' : 'Add day'}
      subtitle={
        isRename
          ? `Day ${dayNumber} · update the name or remove this day`
          : 'Give this day a name'
      }
      showCloseButton={false}
    >
      <View style={styles.field}>
        <Text
          style={[
            theme.typography.labelSm,
            { color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' },
          ]}
        >
          Day name
        </Text>
        <TextInput
          value={name}
          onChangeText={(text) => setName(text.slice(0, MAX_LENGTH))}
          placeholder={isRename ? fallbackName : 'e.g. Old Pink City'}
          placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
          maxLength={MAX_LENGTH}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleSave}
          accessibilityLabel="Day name"
          style={[theme.typography.bodyMd, styles.input]}
        />
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Leave empty to use “{fallbackName}”. {name.length}/{MAX_LENGTH}
        </Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            onPress={onClose}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text
              style={[
                theme.typography.labelMd,
                { color: theme.colors.secondary },
              ]}
            >
              Cancel
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save day name"
            onPress={handleSave}
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
              Save
            </Text>
          </Pressable>
        </View>

        {isRename ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete day"
            accessibilityState={{ disabled: !canDelete }}
            disabled={!canDelete}
            onPress={handleDelete}
            style={({ pressed }) => [
              styles.deleteButton,
              !canDelete && styles.deleteButtonDisabled,
              pressed && canDelete && { opacity: 0.85 },
            ]}
          >
            <MaterialIcons
              name="delete-outline"
              size={18}
              color={canDelete ? theme.colors.error : theme.colors.outline}
            />
            <Text
              style={[
                theme.typography.labelMd,
                {
                  color: canDelete
                    ? theme.colors.error
                    : theme.colors.outline,
                },
              ]}
            >
              Delete day
            </Text>
          </Pressable>
        ) : null}
      </View>
    </BottomSheet>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
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
      minHeight: 44,
    },
    secondaryButton: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 44,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.chip,
      borderWidth: 1,
      borderColor: `${theme.colors.error}66`,
      backgroundColor: `${theme.colors.error}10`,
      minHeight: 44,
    },
    deleteButtonDisabled: {
      borderColor: `${theme.colors.outlineVariant}66`,
      backgroundColor: theme.colors.surfaceContainerLow,
    },
  });
}
