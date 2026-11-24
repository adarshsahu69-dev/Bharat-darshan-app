import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MonumentDetail } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  detail?: MonumentDetail;
};

export function QuickInfoRow({ detail }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  if (!detail) {
    return null;
  }

  const items: {
    key: string;
    icon: 'schedule' | 'payments' | 'wb-sunny' | 'hourglass-top';
    label: string;
    value: string;
  }[] = [
    { key: 'timings', icon: 'schedule', label: 'Timings', value: detail.timings },
    { key: 'fee', icon: 'payments', label: 'Entry Fee', value: detail.entryFee },
    { key: 'best', icon: 'wb-sunny', label: 'Best Time', value: detail.bestTime },
    { key: 'duration', icon: 'hourglass-top', label: 'Duration', value: detail.duration },
  ];

  return (
    <View style={styles.quickRow}>
      {items.map((item) => (
        <View key={item.key} style={styles.quickCard}>
          <MaterialIcons
            name={item.icon}
            size={18}
            color={theme.colors.primary}
          />
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.onSurfaceVariant, marginTop: 4 },
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              theme.typography.labelSm,
              { color: theme.colors.secondary, marginTop: 2 },
            ]}
          >
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    quickRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.lg,
    },
    quickCard: {
      flex: 1,
      padding: theme.spacing.sm,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}4D`,
      alignItems: 'center',
    },
  });
}
