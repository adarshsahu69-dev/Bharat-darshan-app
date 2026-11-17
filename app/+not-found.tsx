import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>
          Page not found
        </Text>
        <Link href="/" style={[theme.typography.label, { color: theme.colors.primary }]}>
          Back to Home
        </Link>
      </View>
    </>
  );
}