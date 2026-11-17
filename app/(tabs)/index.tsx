import { Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme/ThemeProvider';

export default function HomeScreen() {
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
          Bharat Darshan
        </Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted },
          ]}
        >
          Explore the forts, temples and heritage circuits of India.
        </Text>
      </View>
    </Screen>
  );
}