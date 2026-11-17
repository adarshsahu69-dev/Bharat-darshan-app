import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { MapCategory, MapCategoryId } from '@/data/map';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  categories: MapCategory[];
  activeId: MapCategoryId;
  onSelect: (id: MapCategoryId) => void;
};

export function MapCategoryChips({ categories, activeId, onSelect }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((category) => {
        const active = category.id === activeId;
        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${category.label}, ${category.count}`}
            onPress={() => onSelect(category.id)}
            style={({ pressed }) => [
              styles.chip,
              active ? styles.chipActive : styles.chipInactive,
              pressed && { opacity: 0.85 },
            ]}
          >
            <MaterialIcons
              name={category.icon}
              size={14}
              color={active ? theme.colors.onPrimary : theme.colors.primary}
            />
            <Text
              style={[
                theme.typography.labelSm,
                { color: active ? theme.colors.onPrimary : theme.colors.onSurface },
              ]}
            >
              {category.chipLabel} ({category.count})
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    row: {
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      paddingRight: theme.spacing.page,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: theme.radii.chip,
      borderWidth: 1,
    },
    chipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      ...theme.shadows.warmSoft,
    },
    chipInactive: {
      backgroundColor: `${theme.colors.surface}F0`,
      borderColor: `${theme.colors.outlineVariant}99`,
      ...theme.shadows.warmSoft,
    },
  });
}