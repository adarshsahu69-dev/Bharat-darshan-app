import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search 'Amber Fort', 'Chola Temples'...",
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
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
        accessibilityLabel="Search monuments, temples, forts, dynasties"
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
      <MaterialIcons
        name="mic"
        size={18}
        color={theme.colors.outline}
      />
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
  });
}