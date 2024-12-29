import { Alert, StyleSheet } from 'react-native';
import { useSupabase } from '@/context/supabase-provider';
import Button from '../ui/Button';
import Spacings from '@/constants/Spacings';
import { Label, Mono, P } from '../typography';
import Card from '../ui/Card';
import { View, Text } from '../Themed';
import Item from '../ui/Item';
import { ScrollView } from 'react-native';
import AppInfo from '../AppInfo';
import Icon from '../ui/Icon';
import useUserStore from '@/stores/userStore';
import { useCallback } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import React from 'react';
import { useUserItems } from '@/hooks/useUserItems';
import ProfileCard from './ProfileCard';
import usePreferencesStore from '@/stores/preferenceStore';

const THEME_NAME = {
  dark: 'Dark',
  light: 'Light',
  system: 'System',
};

export default function ProfileScreen() {
  const { signOut, user } = useSupabase();
  const profile = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const { isLoading, fetchUserItems } = useUserItems();
  const { userPreferences } = usePreferencesStore();

  useFocusEffect(
    useCallback(() => {
      fetchUserItems();
    }, [])
  );

  // Check for user
  if (!user) {
    return null;
  }

  //Get created time and make a Date object.
  const dateStr = user?.created_at;
  const date = new Date(dateStr);

  //Form at the date as "m YYYY"
  const formattedCreatedAt = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: Spacings.md,
        paddingVertical: Spacings.md,
        paddingHorizontal: Spacings.sm,
      }}
    >
      {profile && (
        <>
          <ProfileCard profileId={profile.id} />
          <View style={styles.editContainer}>
            <Mono secondary>
              Member since <Mono>{formattedCreatedAt}</Mono>
            </Mono>
            <Link
              style={{ width: 'auto' }}
              href={'/profile/account-settings'}
              asChild
            >
              <Button size="sm" title="Edit profile" />
            </Link>
          </View>
        </>
      )}
      <View style={styles.sectionStyle}>
        <Label>Listings</Label>
        <Card style={styles.cardWithListStyle}>
          <Item href={'/profile/listings'} skeleton={isLoading}>
            <Item.Label>My listings</Item.Label>
            <Item.Value>{profile?.items?.length}</Item.Value>
          </Item>
          <Item href={'/listings'} isLastItem disabled>
            <Item.Label>Favorites</Item.Label>
            <Item.Value>4</Item.Value>
          </Item>
        </Card>
      </View>

      <View style={styles.sectionStyle}>
        <Label>Preferences</Label>
        <Card style={styles.cardWithListStyle}>
          <Item href="/profile/notification-preferences">
            <Item.Label>Notifications</Item.Label>
            <Item.Value>
              {userPreferences.notificationsEnabled ? 'Enabled' : 'Disabled'}
            </Item.Value>
          </Item>
          <Item disabled>
            <Item.Label>Location</Item.Label>
            <Item.Value></Item.Value>
          </Item>
          <Item href="/profile/theme-preferences" isLastItem>
            <Item.Label>Theme</Item.Label>
            <Item.Value>{THEME_NAME[userPreferences.theme]}</Item.Value>
          </Item>
        </Card>
      </View>

      <View style={styles.sectionStyle}>
        <Label>More</Label>
        <Card style={styles.cardWithListStyle}>
          <Item disabled>
            <Item.Label>Support</Item.Label>
            <Item.Value />
          </Item>
          <Item disabled isLastItem>
            <Item.Label>About Sanker</Item.Label>
            <Item.Value trailingIcon={<Icon name="ExternalLink" />} />
          </Item>
        </Card>
      </View>

      <View style={{ paddingHorizontal: Spacings.sm }}>
        <Button
          title="Sign out"
          onPress={() => {
            signOut();
            clearUser();
          }}
        />
      </View>

      <AppInfo />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionStyle: {
    gap: Spacings.xs,
  },
  cardWithListStyle: {
    paddingVertical: Spacings.xs,
    paddingHorizontal: Spacings.md,
  },
  editContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: Spacings.md,
  },
});
