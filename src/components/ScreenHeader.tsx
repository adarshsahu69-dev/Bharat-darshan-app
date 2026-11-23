import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export function ScreenHeader({ title, subtitle, right }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <SafeAreaView
      edges={['top']}
      style={{ backgroundColor: theme.colors.surface }}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          hitSlop={8}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.75 },
          ]}
        >
          <MaterialIcons
            name="arrow-back"
            size={22}
            color={theme.colors.onSurface}
          />
        </Pressable>

        <View style={styles.titleWrap}>
          <Text
            numberOfLines={1}
            style={[theme.typography.headlineSm, { color: theme.colors.secondary }]}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              numberOfLines={1}
              style={[
                theme.typography.bodySm,
                { color: theme.colors.onSurfaceVariant, marginTop: 1 },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.right}>{right}</View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.page,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: `${theme.colors.outlineVariant}4D`,
      minHeight: 56,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    titleWrap: {
      flex: 1,
    },
    right: {
      minWidth: 40,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
  });
}
