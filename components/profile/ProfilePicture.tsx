import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useButtonAnimation } from '@/hooks/useButtonAnimation';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useFullscreenViewStore } from '@/stores/useFullscreenViewStore';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { View } from '../Themed';
import { Large } from '../typography';

interface UserData {
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface ProfilePictureProps {
  size: number;
  userId?: string | string[];
  onPress?: () => void;
  pressable?: boolean;
  isLoading?: boolean;
}

export default function ProfilePicture({
  size = 72,
  userId,
  onPress,
  pressable = true,
  isLoading = false,
}: ProfilePictureProps) {
  const colors = useThemedColors();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { show } = useFullscreenViewStore();
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation({
    disabled: !pressable,
  });
  const { userProfile } = useUserProfileStore();
  const currentUserId = userProfile?.id;

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

    if (userId === currentUserId && userProfile?.avatar_url) {
      setUserData({
        avatar_url: userProfile.avatar_url,
        first_name: userProfile.first_name ?? null,
        last_name: userProfile.last_name ?? null,
      });
      return;
    }

    try {
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
    }
  }, [userId, currentUserId, userProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  useEffect(() => {
    if (userId === currentUserId) {
      setUserData({
        avatar_url: userProfile?.avatar_url ?? null,
        first_name: userProfile?.first_name ?? null,
        last_name: userProfile?.last_name ?? null,
      });
    }
  }, [
    userProfile?.avatar_url,
    userProfile?.first_name,
    userProfile?.last_name,
    userId,
    currentUserId,
  ]);

  function getInitials(): string {
    if (!userData?.first_name && !userData?.last_name) return '';

    const firstInitial = userData.first_name?.[0] || '';
    const lastInitial = userData.last_name?.[0] || '';

    return (firstInitial + lastInitial).toUpperCase();
  }

  const handlePress = () => {
    if (!pressable || !userData?.avatar_url) return;

    show(userData.avatar_url);
    router.push('/fullscreen-profile-picture');
    onPress?.();
  };

  const content = (
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
      {isLoading && (
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
  );

  if (!pressable || !userData?.avatar_url) {
    return content;
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Spacings.xxs,
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
