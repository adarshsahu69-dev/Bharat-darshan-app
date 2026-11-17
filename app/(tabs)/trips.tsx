import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/ThemeProvider';

export default function TripsScreen() {
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
          Trips
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Day-wise itineraries, total distance and View Route.
        </Text>
      </View>
    </Screen>
  );
}