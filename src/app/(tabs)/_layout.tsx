import { Tabs } from 'expo-router';
import { House, Library, Share2 } from 'lucide-react-native';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { ReadingColors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ReadingColors.accent,
        tabBarInactiveTintColor: ReadingColors.muted,
        tabBarStyle: {
          backgroundColor: ReadingColors.background,
          borderTopColor: ReadingColors.line,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color }) => <Library size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: 'Status',
          tabBarIcon: ({ color }) => <Share2 size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
