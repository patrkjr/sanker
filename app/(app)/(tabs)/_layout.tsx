import Icon from '@/components/ui/Icon';
import { useSupabase } from '@/context/supabase-provider';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export const unstable_settings = {
  initialRouteName: '/',
};

export default function TabLayout() {
  const colors = useThemedColors();
  const { user } = useSupabase();

  const tabBarStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
  };

  const TabBarIcon = ({ focused, iconName }) => {
    return (
      <Icon
        name={iconName}
        color={focused ? colors.primary : colors.textSecondary}
      />
    );
  };

  if (!user) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: tabBarStyle,
        }}
      >
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
            href: null,
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
            href: null,
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
            href: null,
            title: 'Profile',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} iconName={'User'} />
            ),
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} iconName={'Settings'} />
            ),
            tabBarLabelStyle: styles.tabBarLabelStyle,
          }}
        />
      </Tabs>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: tabBarStyle }}>
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
          //tabBarStyle: hide ? { display: 'none' } : undefined,
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
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} iconName={'Settings'} />
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
