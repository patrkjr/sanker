import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { View } from '../Themed';
import { Large } from '../typography';

interface UserData {
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface ProfilePictureProps {
  size: number;
  userId?: string;
}

export default function ProfilePicture({
  size = 72,
  userId,
}: ProfilePictureProps) {
  const colors = useThemedColors();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  async function fetchUserData() {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url, first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
    } finally {
      setIsFetching(false);
    }
  }

  function getInitials(): string {
    if (!userData?.first_name && !userData?.last_name) return '';

    const firstInitial = userData.first_name?.[0] || '';
    const lastInitial = userData.last_name?.[0] || '';

    return (firstInitial + lastInitial).toUpperCase();
  }

  return (
    <>
      <View
        style={[
          {
            backgroundColor: colors.themed.card,
            borderColor: colors.card,
            width: size,
            height: size,
          },
          styles.profilePicture,
        ]}
      >
        {isFetching && (
          <View style={styles.avatarLoading}>
            <ActivityIndicator
              size={'small'}
              color={Platform.OS === 'ios' ? colors.themed.card : undefined}
            />
          </View>
        )}
        {userData?.avatar_url ? (
          <Image
            style={{ width: size, height: size }}
            accessibilityLabel="Avatar"
            source={userData.avatar_url}
          />
        ) : (
          <Large bold style={{ textAlign: 'center' }}>
            {getInitials() || '🥾'}
          </Large>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: Spacings.borderRadius.round,
  },
  avatarLoading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
