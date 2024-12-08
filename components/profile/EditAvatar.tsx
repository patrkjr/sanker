import { useThemedColors } from '@/hooks/useThemedColors';
import { View } from '../Themed';
import { P } from '../typography';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import Spacings from '@/constants/Spacings';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import useUserStore from '@/stores/userStore';
import { supabase } from '@/config/supabase';
import * as Haptics from 'expo-haptics';
import Button from '../ui/Button';
import { useSupabase } from '@/context/supabase-provider';
import ProfilePicture from './ProfilePicture';

// This component can be updated to only take needed props
// Right now it takes a whole profile, but only uses names and image url

interface Profile {
  id: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone_verified?: boolean;
  // Add any other properties that are relevant to the profile
}

interface ProfilePictureProps {
  profile: Profile;
  size: number;
  editable: boolean;
  updateProfilePicture: () => void;
}

export default function EditAvatar({
  editable = false,

  size = 72,
}: ProfilePictureProps) {
  const { user } = useSupabase();
  const userProfile = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdateProfilePicture() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        //User cancelled the image picker.
        return;
      }

      setIsLoading(true);
      const image = result.assets[0];

      if (!image.uri) {
        throw new Error('No image uri!'); // Realistically, this should never happen, but just in case...
      }

      // Get URI of the image
      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      // Get the file extention of the image
      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
      // make a new filename for the image based on current time
      const path = `${Date.now()}.${fileExt}`;

      // Upload the image and return the url
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { error: avatarError } = await supabase
        .from('users')
        .update({ avatar_url: path })
        .eq('id', user.id);

      if (avatarError) {
        throw avatarError;
      }

      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([userProfile?.avatar_url]);

      if (deleteError) {
        throw deleteError;
      }

      setUser({ ...userProfile, avatar_url: path });
    } catch (error) {
      console.log(error);
      Alert.alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  }
  //Get the initials from the first and last name (first and last name not yet implemented in supabase)
  function getInitials() {
    if (!userProfile || !userProfile.first_name || !userProfile.last_name) {
      return '🥾';
    }

    const firstInitial = userProfile.first_name.charAt(0).toUpperCase();
    const lastInitial = userProfile.last_name.charAt(0).toUpperCase();

    return firstInitial + lastInitial;
  }

  const colors = useThemedColors();

  return (
    <>
      <ProfilePicture
        isLoading={isLoading}
        profile={userProfile}
        avatarUrl={userProfile?.avatar_url}
      />
      <Button
        size="sm"
        title="Edit profile picture"
        style={{ width: 'auto' }}
        disabled={!editable || isLoading}
        onPress={() =>
          userProfile?.id === user?.id && handleUpdateProfilePicture()
        }
        onPressOut={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      />
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
