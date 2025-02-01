import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useButtonAnimation } from '@/hooks/useButtonAnimation';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useFullscreenViewStore } from '@/stores/useFullscreenViewStore';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
  userId?: string;
  onPress?: () => void;
  pressable?: boolean;
  isFetching?: boolean;
}

export default function ProfilePicture({
  size = 72,
  userId,
  onPress,
  pressable = true,
  isFetching = false,
}: ProfilePictureProps) {
  const colors = useThemedColors();
  const [userData, setUserData] = useState<UserData | null>(null);
  const { show } = useFullscreenViewStore();
  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation({
    disabled: !pressable,
  });

  const fetchUserData = useCallback(async () => {
    if (!userId) return;

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
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

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
