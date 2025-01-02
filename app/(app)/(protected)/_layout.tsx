import Icon from '@/components/ui/Icon';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Stack, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ProtectedLayout() {
  const colors = useThemedColors();

  const TabBarIcon = ({ focused, iconName }) => {
    return (
      <Icon
        name={iconName}
        color={focused ? colors.primary : colors.textSecondary}
      />
    );
  };

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName={'House'} />
          ),
          tabBarLabelStyle: styles.tabBarLabelStyle,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName={'CirclePlus'} />
          ),
          tabBarLabelStyle: styles.tabBarLabelStyle,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName={'User'} />
          ),
          tabBarLabelStyle: styles.tabBarLabelStyle,
        }}
      />
      <Stack.Screen
        name="chat"
        options={{ href: null, presentation: 'modal' }}
      />
      {/* 
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
        }}
      /> */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontFamily: 'Nunito',
    fontWeight: '800',
  },
});
