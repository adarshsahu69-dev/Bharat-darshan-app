import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  label: string;
  value: string;
  detail: string;
  icon: 'location-on' | 'account-balance-wallet';
  tone?: 'primary' | 'gold';
};

export function TripStatCard({
  label,
  value,
  detail,
  icon,
  tone = 'primary',
}: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const accent =
    tone === 'gold' ? theme.colors.gold : theme.colors.primary;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text
          style={[
            theme.typography.labelSm,
            { color: theme.colors.onSurfaceVariant, textTransform: 'uppercase' },
          ]}
        >
          {label}
        </Text>
        <View style={styles.iconWrap}>
          <MaterialIcons name={icon} size={16} color={accent} />
        </View>
      </View>

      <Text
        style={[
          theme.typography.headlineSmBold,
          { color: theme.colors.secondary },
        ]}
      >
        {value}
      </Text>
      <Text
        style={[
          theme.typography.labelMd,
          { color: theme.colors.onSurfaceVariant },
        ]}
      >
        {detail}
      </Text>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      flex: 1,
      padding: theme.spacing.md,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      ...theme.shadows.warmSoft,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    iconWrap: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
  });
}