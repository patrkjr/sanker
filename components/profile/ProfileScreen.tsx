import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import usePreferencesStore from '@/stores/preferenceStore';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { Link } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View } from '../Themed';
import { Label, Mono } from '../typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Item from '../ui/Item';
import PageScrollView from '../ui/PageScrollView';
import ProfileCard from './ProfileCard';

const THEME_NAME = {
  dark: 'Dark',
  light: 'Light',
  system: 'System',
};

export default function ProfileScreen() {
  const { signOut, user } = useSupabase();
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const clearUserProfile = useUserProfileStore(
    (state) => state.clearUserProfile
  );
  const { userPreferences, resetPreferences } = usePreferencesStore();

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
    clearUserProfile();
    resetPreferences();
  }

  return (
    <PageScrollView>
      {userProfile && (
        <>
          <ProfileCard profileId={userProfile.id} />
          <View style={styles.editContainer}>
            <Mono secondary>
              Joined <Mono>{formattedCreatedAt}</Mono>
            </Mono>
            <Link
              style={{ width: 'auto' }}
              href={'/profile/edit-profile'}
              asChild
            >
              <Button size="sm" title="Edit profile" />
            </Link>
          </View>
        </>
      )}

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
