import { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';

type Props = {
  eyebrow: string;
  title: string;
  right?: ReactNode;
};

export function SectionHeader({ eyebrow, title, right }: Props) {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={[
            theme.typography.labelSm,
            { color: theme.colors.primary, textTransform: 'uppercase' },
          ]}
        >
          {eyebrow}
        </Text>
        <Text
          style={[
            theme.typography.headlineSm,
            { color: theme.colors.secondary, marginTop: 2 },
          ]}
        >
          {title}
        </Text>
      </View>
      {right}
    </View>
  );
}