import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useMemo } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenHeader } from '@/components/ScreenHeader';
import { dataSources, photoCredits } from '@/content/credits';
import { CONTACT_EMAIL } from '@/content/privacy';
import { useTheme } from '@/theme/ThemeProvider';

export default function AboutScreen() {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const version =
    Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? '1.0.0';

  const openFeedback = async () => {
    const subject = encodeURIComponent('Bharat Darshan feedback');
    const body = encodeURIComponent('Hi Bharat Darshan team,\n\n');
    const url = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Unable to open mail', `Please email us at ${CONTACT_EMAIL}.`);
    }
  };

  const rateApp = () => {
    Alert.alert('Coming soon', 'Rating will be available when the app is published.');
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="About" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroCard}>
          <Text
            style={[theme.typography.brand, { color: theme.colors.primary }]}
          >
            Bharat Darshan
          </Text>
          <Text
            style={[
              theme.typography.bodySm,
              { color: theme.colors.onSurfaceVariant, marginTop: 4 },
            ]}
          >
            Version {version}
          </Text>
          <Text
            style={[
              theme.typography.bodyMd,
              {
                color: theme.colors.onSurfaceVariant,
                marginTop: theme.spacing.md,
                textAlign: 'center',
                lineHeight: 22,
              },
            ]}
          >
            Bharat Darshan celebrates India&apos;s living heritage — from ancient forts
            and temples to palaces, museums, and natural wonders — helping you
            discover, save, and plan meaningful journeys across the country.
          </Text>
          <Text
            style={[
              theme.typography.labelMd,
              { color: theme.colors.primary, marginTop: theme.spacing.md },
            ]}
          >
            Made in India
          </Text>
        </View>

        <View style={styles.card}>
          <ActionRow
            icon="mail-outline"
            label="Send Feedback"
            description={`Email us at ${CONTACT_EMAIL}`}
            onPress={openFeedback}
          />
          <View style={styles.divider} />
          <ActionRow
            icon="star-outline"
            label="Rate the app"
            description="Coming soon"
            onPress={rateApp}
          />
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.labelSm, styles.sectionLabel]}>
            Photo Credits
          </Text>
          <View style={styles.card}>
            {photoCredits.map((credit, index) => (
              <View key={`${credit.monument}-${index}`}>
                <View style={styles.creditRow}>
                  <Text
                    style={[
                      theme.typography.bodyMd,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {credit.monument}
                  </Text>
                  <Text
                    style={[
                      theme.typography.bodySm,
                      { color: theme.colors.onSurfaceVariant, marginTop: 2 },
                    ]}
                  >
                    {credit.source}
                  </Text>
                  <Text
                    style={[
                      theme.typography.labelSm,
                      { color: theme.colors.primary, marginTop: 4 },
                    ]}
                  >
                    {credit.license}
                  </Text>
                </View>
                {index < photoCredits.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[theme.typography.labelSm, styles.sectionLabel]}>
            Data Sources
          </Text>
          <View style={styles.card}>
            {dataSources.map((source, index) => (
              <View key={source}>
                <View style={styles.creditRow}>
                  <Text
                    style={[
                      theme.typography.bodySm,
                      { color: theme.colors.onSurfaceVariant, lineHeight: 20 },
                    ]}
                  >
                    {source}
                  </Text>
                </View>
                {index < dataSources.length - 1 ? (
                  <View style={styles.divider} />
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionRow({
  icon,
  label,
  description,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionRow,
        pressed && { backgroundColor: theme.colors.surfaceContainer },
      ]}
    >
      <View style={styles.actionIcon}>
        <MaterialIcons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[theme.typography.bodyMd, { color: theme.colors.onSurface }]}>
          {label}
        </Text>
        <Text
          style={[
            theme.typography.bodySm,
            { color: theme.colors.onSurfaceVariant, marginTop: 1 },
          ]}
        >
          {description}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={theme.colors.outline} />
    </Pressable>
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
      gap: theme.spacing.xl,
    },
    heroCard: {
      alignItems: 'center',
      padding: theme.spacing.xl,
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
    },
    card: {
      borderRadius: theme.radii.card,
      backgroundColor: theme.colors.surfaceContainerLow,
      borderWidth: 1,
      borderColor: `${theme.colors.outlineVariant}66`,
      overflow: 'hidden',
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionLabel: {
      color: theme.colors.primary,
      textTransform: 'uppercase',
      paddingHorizontal: theme.spacing.xs,
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: 14,
      minHeight: 56,
    },
    actionIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceContainer,
    },
    divider: {
      height: 1,
      backgroundColor: `${theme.colors.outlineVariant}66`,
      marginLeft: 68,
    },
    creditRow: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: 14,
    },
  });
}
