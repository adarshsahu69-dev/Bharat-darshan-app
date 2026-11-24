import { MaterialIcons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MonumentDetail } from '@/data/monuments';
import { useTheme } from '@/theme/ThemeProvider';

import { ReviewsPreview } from './ReviewsPreview';

const detailTabs = ['Overview', 'History & Lore', 'How to Reach', 'Nearby Places'];

type Props = {
  detail?: MonumentDetail;
};

export function DetailTabs({ detail }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const [active, setActive] = useState(detailTabs[0]);

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabRow}
      >
        {detailTabs.map((tab) => {
          const selected = tab === active;
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab}
              onPress={() => setActive(tab)}
              style={[
                styles.tab,
                selected ? styles.tabActive : styles.tabInactive,
              ]}
            >
              <Text
                style={[
                  theme.typography.labelMd,
                  selected
                    ? { color: theme.colors.primary, fontWeight: '700' }
                    : { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {active === 'Overview' && detail ? (
        <View style={styles.panel}>
          <Text
            style={[
              theme.typography.bodyMd,
              { color: theme.colors.onSurfaceVariant, lineHeight: 22 },
            ]}
          >
            {detail.overview}
          </Text>

          <Text
            style={[
              theme.typography.headlineSm,
              { color: theme.colors.secondary, marginTop: theme.spacing.lg },
            ]}
          >
            Key Highlights
          </Text>
          <View style={styles.highlights}>
            {detail.highlights.map((highlight) => (
              <View key={highlight.title} style={styles.highlight}>
                <MaterialIcons
                  name={highlight.icon}
                  size={20}
                  color={theme.colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      theme.typography.labelMd,
                      { color: theme.colors.secondary, fontWeight: '700' },
                    ]}
                  >
                    {highlight.title}
                  </Text>
                  <Text
                    style={[
                      theme.typography.bodySm,
                      {
                        color: theme.colors.onSurfaceVariant,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {highlight.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.audioBanner}>
            <View style={styles.audioLeft}>
              <View style={styles.audioIcon}>
                <MaterialIcons
                  name="headphones"
                  size={22}
                  color={theme.colors.goldSoft}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    theme.typography.labelMd,
                    { color: theme.colors.onSecondary, fontWeight: '700' },
                  ]}
                >
                  {detail.audioTour.title}
                </Text>
                <Text
                  style={[
                    theme.typography.bodySm,
                    {
                      color: `${theme.colors.onSecondary}CC`,
                      marginTop: 2,
                    },
                  ]}
                >
                  {detail.audioTour.subtitle}
                </Text>
              </View>
            </View>
            <View style={styles.listenButton}>
              <Text
                style={[
                  theme.typography.labelSm,
                  { color: theme.colors.onPrimary },
                ]}
              >
                {detail.audioTour.price}
              </Text>
            </View>
          </View>
        </View>
      ) : active !== 'Overview' ? (
        <View style={styles.panel}>
          <Text
            style={[
              theme.typography.bodyMd,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {active === 'History & Lore'
              ? 'Amber Fort was founded by Raja Alan Singh in 967 CE and expanded by the Kachwaha rulers of Jaipur from the 16th century onward.'
              : active === 'How to Reach'
                ? 'Amber Fort is 11 km from Jaipur city centre. Public buses and taxis run from the Pink City, and the Sun Gate is the main visitor entrance.'
                : 'Nearby attractions include Jaigarh Fort, Nahargarh Fort, Jal Mahal and the old walled city of Amer.'}
          </Text>
        </View>
      ) : null}

      <ReviewsPreview detail={detail} />
    </View>
  );
}

function makeStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    tabRow: {
      gap: theme.spacing.lg,
      paddingRight: theme.spacing.page,
      marginTop: theme.spacing.lg,
    },
    tab: {
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 2,
    },
    tabActive: {
      borderBottomColor: theme.colors.primary,
    },
    tabInactive: {
      borderBottomColor: 'transparent',
    },
    panel: {
      paddingTop: theme.spacing.lg,
    },
    highlights: {
      marginTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    highlight: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.surfaceContainer,
    },
    audioBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.radii.default,
      backgroundColor: theme.colors.secondary,
      marginTop: theme.spacing.lg,
    },
    audioLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flex: 1,
    },
    audioIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${theme.colors.onSecondary}1A`,
    },
    listenButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 6,
      borderRadius: theme.radii.chip,
      backgroundColor: theme.colors.primary,
    },
  });
}
