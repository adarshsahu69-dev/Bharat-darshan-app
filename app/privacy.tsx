import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import {
  PRIVACY_LAST_UPDATED,
  PRIVACY_POLICY_URL,
  privacySections,
} from '@/content/privacy';
import { useTheme } from '@/theme/ThemeProvider';

export default function PrivacyScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const openOnlineVersion = async () => {
    try {
      await WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL);
    } catch {
      /* Browser unavailable. */
    }
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="Privacy Policy" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Last updated: {PRIVACY_LAST_UPDATED}
        </Text>

        {privacySections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text
              style={[
                theme.typography.titleMd,
                { color: theme.colors.secondary },
              ]}
            >
              {section.title}
            </Text>
            <Text
              style={[
                theme.typography.bodyMd,
                { color: theme.colors.onSurfaceVariant, marginTop: 6, lineHeight: 22 },
              ]}
            >
              {section.body}
            </Text>
          </View>
        ))}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View online version of privacy policy"
          onPress={openOnlineVersion}
          style={({ pressed }) => [
            styles.linkRow,
            pressed && { opacity: 0.85 },
          ]}
        >
          <View style={styles.linkIcon}>
            <MaterialIcons
              name="open-in-new"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}
            >
              View online version
            </Text>
            <Text
              style={[
                theme.typography.bodySm,
                { color: theme.colors.onSurfaceVariant, marginTop: 1 },
              ]}
            >
              Opens the hosted privacy policy
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={theme.colors.outline}
          />
        </Pressable>
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: theme.spacing.page,
      paddingBottom: theme.spacing.section,
      gap: theme.spacing.lg,
    },
    section: {
      padding: theme.spacing.lg,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      minHeight: 56,
    },
    linkIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
  });
}
