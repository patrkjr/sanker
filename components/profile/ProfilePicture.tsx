import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet } from 'react-native';
import { View } from '../Themed';
import { P } from '../typography';

// This component can be updated to only take needed props
// Right now it takes a whole profile, but only uses names and image url

interface ProfilePictureProps {
  size: number;
  userId?: string;
}

export default function ProfilePicture({
  size = 72,
  userId,
}: ProfilePictureProps) {
  const colors = useThemedColors();
  const [fetchedAvatarUrl, setFetchedAvatarUrl] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAvatarUrl();
    }
  }, [userId]);

  async function fetchAvatarUrl() {
    try {
      setIsFetching(true);
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setFetchedAvatarUrl(data?.avatar_url || null);
    } catch (error) {
      console.error('Error fetching avatar:', error);
      setFetchedAvatarUrl(null);
    } finally {
      setIsFetching(false);
    }
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
        {fetchedAvatarUrl ? (
          <Image
            style={{ width: size, height: size }}
            accessibilityLabel="Avatar"
            source={fetchedAvatarUrl}
          />
        ) : (
          <P bold style={{ textAlign: 'center' }}>
            🥾
          </P>
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
