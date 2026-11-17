import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/ThemeProvider';

export function Screen({ children }: { children: ReactNode }) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top']}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: theme.spacing.page,
          paddingTop: theme.spacing.lg,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}