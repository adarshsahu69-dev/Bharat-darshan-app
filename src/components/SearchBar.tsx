import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  showMic?: boolean;
  compact?: boolean;
  accessibilityLabel?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search 'Amber Fort', 'Chola Temples'...",
  onClear,
  showMic = true,
  compact = false,
  accessibilityLabel = 'Search monuments, temples, forts, dynasties',
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <MaterialIcons
        name="search"
        size={20}
        color={theme.colors.primary}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={`${theme.colors.onSurfaceVariant}B3`}
        accessibilityLabel={accessibilityLabel}
        returnKeyType="search"
        style={[
          theme.typography.bodyMd,
          {
            flex: 1,
            padding: 0,
            color: theme.colors.onSurface,
          },
        ]}
      />
      {onClear ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={onClear}
          hitSlop={8}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <MaterialIcons
            name="close"
            size={16}
            color={theme.colors.outline}
          />
        </Pressable>
      ) : showMic ? (
        <MaterialIcons
          name="mic"
          size={18}
          color={theme.colors.outline}
        />
      ) : null}
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}80`,
      ...theme.shadows.warmSoft,
    },
    compact: {
      paddingHorizontal: 14,
    },
    clearButton: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}