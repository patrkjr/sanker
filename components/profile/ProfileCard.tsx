import React from 'react';
import { useEffect, useState } from 'react';
import { View } from '../Themed';
import { Alert, StyleSheet } from 'react-native';
import { H3, P, Small } from '../typography';
import { supabase } from '@/config/supabase';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { useThemedColors } from '@/hooks/useThemedColors';
import Spacings from '@/constants/Spacings';
import SelectableTag from '../ui/SelectableTag';
import SkeletonBox from '../ui/SkeletonBox';
import ProfilePicture from './ProfilePicture';
import { useSupabase } from '@/context/supabase-provider';

interface ProfileCardTypes {
  profileId: string;
}

const IMAGE_SIZE = 72;
const COVER_AREA_HEIGHT = 80;
const MARGIN_TOP = COVER_AREA_HEIGHT - IMAGE_SIZE / 2;

export default function ProfileCard({ profileId }: ProfileCardTypes) {
  const colors = useThemedColors();
  const [profile, setProfile] = useState(null);
  const { user } = useSupabase();
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id === profileId) {
      setProfile(userProfile);
      setIsLoading(false);
      return;
    }
    getProfileDataAsync();
  }, [userProfile]);

  //Get the profile info from supabase
  async function getProfileDataAsync() {
    try {
      if (!profileId) {
        throw new Error('No profileId provided.');
      }
      const { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (!data) {
        throw new Error('No profile found');
      }
      setProfile(data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  // COMPONENT HERE

  return (
    <View
      style={[styles.shadowWrapper, { shadowColor: colors.permanent.black }]}
    >
      <View
        style={[
          { backgroundColor: colors.card, borderColor: colors.border },
          styles.outerContainer,
        ]}
      >
        <View
          style={{
            backgroundColor: colors.themed.card,
            height: COVER_AREA_HEIGHT,
            width: '100%',
            position: 'absolute',
          }}
        />
        <View style={styles.contentContainer}>
          <ProfilePicture avatarUrl={profile?.avatar_url} size={IMAGE_SIZE} />
          {/* Should probably improve the layout of this at some point */}
          {profile?.phone_verified && (
            <View
              style={{
                backgroundColor: 'transparent',
                height: 'auto',
                transform: [{ translateY: -25 }],
              }}
            >
              <SelectableTag
                showSelectable={false}
                text="Phone verified"
                selected
                mono
              />
            </View>
          )}
        </View>
        <View style={styles.nameContainer}>
          {profile ? (
            <H3>
              {profile.first_name} {profile.last_name}
            </H3>
          ) : (
            <View
              style={{ backgroundColor: 'transparent', height: 32, width: 180 }}
            >
              <SkeletonBox />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
    borderRadius: Spacings.borderRadius.md,
  },
  outerContainer: {
    height: 182,
    overflow: 'hidden',
    borderRadius: Spacings.borderRadius.md,
  },
  contentContainer: {
    paddingHorizontal: Spacings.md,
    marginTop: MARGIN_TOP,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameContainer: {
    backgroundColor: 'transparent',
    padding: Spacings.md,
  },
});
