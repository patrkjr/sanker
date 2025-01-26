import Icon from '@/components/ui/Icon';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
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
        name="my-listings"
        options={{
          title: 'My listings',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName={'Newspaper'} />
          ),
          tabBarLabelStyle: styles.tabBarLabelStyle,
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName={'Send'} />
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarLabelStyle: {
    fontFamily: 'Nunito-Bold',
  },
});
