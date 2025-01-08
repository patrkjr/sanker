import { Alert, StyleSheet } from 'react-native';
import { useSupabase } from '@/context/supabase-provider';
import Button from '../ui/Button';
import Spacings from '@/constants/Spacings';
import { Label, Mono, P } from '../typography';
import Card from '../ui/Card';
import { View, Text } from '../Themed';
import Item from '../ui/Item';
import AppInfo from '../AppInfo';
import Icon from '../ui/Icon';
import useUserStore from '@/stores/userStore';
import { useCallback } from 'react';
import { Link, useFocusEffect } from 'expo-router';
import React from 'react';
import { useUserItems } from '@/hooks/useUserItems';
import ProfileCard from './ProfileCard';
import usePreferencesStore from '@/stores/preferenceStore';
import DefaultStyles from '@/constants/DefaultStyles';
import PageScrollView from '../ui/PageScrollView';

const THEME_NAME = {
  dark: 'Dark',
  light: 'Light',
  system: 'System',
};

export default function ProfileScreen() {
  const { signOut, user } = useSupabase();
  const profile = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const { isLoading: isLoadingUserItems, fetchUserItems } = useUserItems();
  const { userPreferences, resetPreferences } = usePreferencesStore();

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

  function onPressSignout() {
    Alert.alert('Are you sure you want to sign out?', '', [
      {
        text: 'Stay signed in',
        style: 'cancel',
        isPreferred: true,
      },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: handleSignOut,
      },
    ]);
  }

  function handleSignOut() {
    signOut();
    clearUser();
    resetPreferences();
  }

  return (
    <PageScrollView>
      {profile && (
        <>
          <ProfileCard profileId={profile.id} />
          <View style={styles.editContainer}>
            <Mono secondary>
              Joined <Mono>{formattedCreatedAt}</Mono>
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
          <Item href={'/profile/listings'} skeleton={isLoadingUserItems}>
            <Item.Label>My listings</Item.Label>
            <Item.Value>{profile?.items?.length}</Item.Value>
          </Item>
          <Item href={'/profile/favorits'} disabled isLastItem>
            <Item.Label>Favorites</Item.Label>
            <Item.Value></Item.Value>
            {/* Show the count here at some point */}
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
          <Item href="/profile/location-preferences">
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
          <Item href={'/profile/about'} isLastItem>
            <Item.Label>About Sanker</Item.Label>
            <Item.Value trailingIcon={<Icon name="ExternalLink" />} />
          </Item>
        </Card>
      </View>

      <Button title="Sign out" onPress={onPressSignout} />
    </PageScrollView>
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
