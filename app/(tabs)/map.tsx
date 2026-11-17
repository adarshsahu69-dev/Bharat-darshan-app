import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/ThemeProvider';

export default function MapScreen() {
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
          Heritage Map
        </Text>
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          Monuments by category, with a preview on tap.
        </Text>
      </View>
    </Screen>
  );
}