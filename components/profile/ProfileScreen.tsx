import { Alert, StyleSheet } from 'react-native';
import { useSupabase } from '@/context/supabase-provider';
import Button from '../ui/Button';
import Spacings from '@/constants/Spacings';
import { Label, P } from '../typography';
import Card from '../ui/Card';
import { View, Text } from '../Themed';
import Item from '../ui/Item';
import { ScrollView } from 'react-native';
import AppInfo from '../AppInfo';
import Icon from '../ui/Icon';
import useUserStore from '@/stores/userStore';
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import React from 'react';
import { useUserItems } from '@/hooks/useUserItems';
import ProfileCard from './ProfileCard';

export default function ProfileScreen() {
  const { signOut } = useSupabase();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const { isLoading, fetchUserItems } = useUserItems();

  useFocusEffect(
    useCallback(() => {
      fetchUserItems();
    }, [])
  );

  const UserProfileInfo = () => {
    return (
      <View style={styles.profileContainer}>
        <Text>{user?.email}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{
        gap: Spacings.md,
        paddingVertical: Spacings.md,
        paddingHorizontal: Spacings.sm,
      }}
    >
      {user ? <ProfileCard profileId={user.id} /> : <Text>No user</Text>}
      <View style={styles.sectionStyle}>
        <Label>Listings</Label>
        <Card style={styles.cardWithListStyle}>
          <Item href={'/profile/listings'} skeleton={isLoading}>
            <Item.Label>My listings</Item.Label>
            <Item.Value>{user?.items?.length}</Item.Value>
          </Item>
          <Item href={'/profile/listings'} isLastItem disabled>
            <Item.Label>Favorites</Item.Label>
            <Item.Value>4</Item.Value>
          </Item>
        </Card>
      </View>

      <View style={styles.sectionStyle}>
        <Label>Profile</Label>
        <Card style={styles.cardWithListStyle}>
          <Item href={'profile/account-settings'}>
            <Item.Label>Edit Profile</Item.Label>
            <Item.Value></Item.Value>
          </Item>
          <Item disabled>
            <Item.Label>Notifications</Item.Label>
            <Item.Value></Item.Value>
          </Item>
          <Item disabled isLastItem>
            <Item.Label>Location</Item.Label>
            <Item.Value></Item.Value>
          </Item>
        </Card>
      </View>

      <View style={styles.sectionStyle}>
        <Label>More</Label>
        <Card style={styles.cardWithListStyle}>
          <Item disabled>
            <Item.Label>Edit theme</Item.Label>
            <Item.Value>System</Item.Value>
          </Item>
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
  profileContainer: {
    marginHorizontal: Spacings.sm,
    padding: Spacings.md,
  },
});
