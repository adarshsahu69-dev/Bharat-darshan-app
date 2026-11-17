import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/ThemeProvider';

export default function ExploreScreen() {
  const theme = useTheme();

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={[
            theme.typography.headline,
            { color: theme.colors.text, marginBottom: theme.spacing.sm },
          ]}
        >
          Explore
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Search monuments, filter by state or category.
        </Text>
      </View>
    </Screen>
  );
}