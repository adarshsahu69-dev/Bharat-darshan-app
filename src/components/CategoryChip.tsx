import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { CategoryIcon, CategoryTone } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  label: string;
  icon: CategoryIcon;
  tone?: CategoryTone;
  active?: boolean;
  onPress?: () => void;
};

export function CategoryChip({
  label,
  icon,
  tone = 'primary',
  active = false,
  onPress,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const toneColor: Record<CategoryTone, string> = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    gold: theme.colors.gold,
    emerald: theme.colors.emerald,
    muted: theme.colors.onSurfaceVariant,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.active : styles.inactive,
        pressed && { opacity: 0.85 },
      ]}
    >
      <MaterialIcons
        name={icon}
        size={16}
        color={active ? theme.colors.onPrimary : toneColor[tone]}
      />
      <Text
        style={[
          theme.typography.labelMd,
          { color: active ? theme.colors.onPrimary : theme.colors.onSurface },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
    },
    active: {
      backgroundColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
    inactive: {
      backgroundColor: theme.colors.surfaceContainer,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
  });
}