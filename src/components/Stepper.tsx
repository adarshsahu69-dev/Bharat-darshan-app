import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Prefix shown inside the numeric field, e.g. "₹". */
  prefix?: string;
  label: string;
  accentColor?: string;
};

/**
 * Minus / numeric input / plus control.
 *
 * The middle is a real TextInput so the value can be typed directly; the
 * steppers adjust by `step` and clamp to [min, max].
 */
export function Stepper({
  value,
  onChange,
  step = 100,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  prefix = '₹',
  label,
  accentColor,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [draft, setDraft] = useState<string | null>(null);

  const accent = accentColor ?? theme.colors.primary;

  const parsedDraft = (): number | null => {
    if (draft === null) {
      return null;
    }
    const parsed = Number(draft.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  };

  const commit = (raw: string) => {
    const parsed = Number(raw.replace(/[^0-9]/g, ''));
    const next = Number.isFinite(parsed) ? parsed : min;
    const clamped = Math.min(max, Math.max(min, next));
    setDraft(null);
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  // Apply a step relative to whatever the field currently shows (typed draft or
  // committed value) so +/- never discards a number the user is mid-typing.
  const stepBy = (delta: number) => {
    const base = parsedDraft() ?? value;
    const next = Math.min(max, Math.max(min, base + delta));
    setDraft(null);
    if (next !== value) {
      onChange(next);
    }
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
        onPress={() => stepBy(-step)}
        disabled={value <= min}
        hitSlop={6}
        style={({ pressed }) => [
          styles.stepButton,
          { borderColor: accent },
          (pressed || value <= min) && styles.stepButtonDisabled,
        ]}
      >
        <MaterialIcons
          name="remove"
          size={18}
          color={value <= min ? theme.colors.outline : accent}
        />
      </Pressable>

      <View style={[styles.inputWrap, { borderColor: `${accent}55` }]}>
        <TextInput
          value={draft ?? String(value)}
          onChangeText={setDraft}
          onBlur={() => commit(draft ?? String(value))}
          onSubmitEditing={() => commit(draft ?? String(value))}
          keyboardType="number-pad"
          selectTextOnFocus
          accessibilityLabel={`${label} amount`}
          style={[theme.typography.titleMd, styles.input]}
          placeholderTextColor={`${theme.colors.onSurfaceVariant}80`}
        />
        {prefix ? (
          <Text
            style={[theme.typography.titleMd, { color: theme.colors.onSurfaceVariant }]}
          >
            {prefix}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
        onPress={() => stepBy(step)}
        disabled={value >= max}
        hitSlop={6}
        style={({ pressed }) => [
          styles.stepButton,
          { borderColor: accent },
          (pressed || value >= max) && styles.stepButtonDisabled,
        ]}
      >
        <MaterialIcons name="add" size={18} color={accent} />
      </Pressable>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    stepButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    stepButtonDisabled: {
      opacity: 0.4,
    },
    inputWrap: {
      flex: 1,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radii.chip,
      borderWidth: 1,
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    input: {
      flex: 1,
      padding: 0,
      color: theme.colors.onSurface,
      textAlign: 'right',
    },
  });
}