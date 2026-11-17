import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { ExploreFilterIcon } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  label: string;
  icon?: ExploreFilterIcon;
  iconTone?: 'primary' | 'gold' | 'outline';
  active?: boolean;
  showChevron?: boolean;
  onPress?: () => void;
};

export function FilterChip({
  label,
  icon,
  iconTone = 'primary',
  active = false,
  showChevron = false,
  onPress,
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const toneColor: Record<'primary' | 'gold' | 'outline', string> = {
    primary: theme.colors.primary,
    gold: theme.colors.gold,
    outline: theme.colors.outline,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.chip,
        active ? styles.active : styles.inactive,
        pressed && { opacity: 0.85 },
      ]}
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={14}
          color={active ? theme.colors.onSecondary : toneColor[iconTone]}
        />
      ) : null}
      <Text
        style={[
          active ? theme.typography.labelSm : theme.typography.labelSmMedium,
          { color: active ? theme.colors.onSecondary : theme.colors.onSurface },
        ]}
      >
        {label}
      </Text>
      {showChevron ? (
        <MaterialIcons
          name="arrow-drop-down"
          size={14}
          color={active ? theme.colors.onSecondary : theme.colors.outline}
        />
      ) : null}
    </Pressable>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: theme.radii.chip,
    },
    active: {
      backgroundColor: theme.colors.secondary,
      ...theme.shadows.warmSoft,
    },
    inactive: {
      backgroundColor: theme.colors.surfaceContainer,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}80`,
    },
  });
}