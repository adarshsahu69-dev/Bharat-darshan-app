import { ComponentProps } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { useTheme } from '@/theme/ThemeProvider';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName; activeIcon: IconName }[] =
  [
    { name: 'index', title: 'Home', icon: 'home-outline', activeIcon: 'home' },
    {
      name: 'explore',
      title: 'Explore',
      icon: 'search-outline',
      activeIcon: 'search',
    },
    {
      name: 'saved',
      title: 'Saved',
      icon: 'bookmark-outline',
      activeIcon: 'bookmark',
    },
    {
      name: 'trips',
      title: 'Trips',
      icon: 'calendar-outline',
      activeIcon: 'calendar',
    },
  ];

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.label.fontFamily,
          fontSize: theme.typography.caption.fontSize,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? tab.activeIcon : tab.icon}
                size={24}
                color={color as string}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}