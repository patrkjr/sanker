import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import { useThemedColors } from '@/hooks/useThemedColors';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { compressImage } from '@/utils/compressImage';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Button from '../ui/Button';
import ProfilePicture from './ProfilePicture';

// This component can be updated to only take needed props
// Right now it takes a whole profile, but only uses names and image url

interface Profile {
  id: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
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
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);
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

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;

      const compressedImage = await compressImage(image.uri, 500, (error) => {
        throw new Error(error);
      });

      const arraybuffer = await fetch(compressedImage.uri).then((res) =>
        res.arrayBuffer()
      );

      // Upload the compressed image and return the url
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public url of the uploaded image
      const { data: publicUrlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      // Get the current avatar file name
      const { data: currentAvatarData, error: currentAvatarError } =
        await supabase
          .from('users')
          .select('avatar_file_name')
          .eq('id', user?.id);

      if (currentAvatarError) {
        throw currentAvatarError;
      }

      // Update the avatar url and file name
      const { data: avatarData, error: avatarError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl, avatar_file_name: path })
        .eq('id', user?.id)
        .select('avatar_url, avatar_file_name');

      if (avatarError) {
        throw avatarError;
      }

      // Check if there is an existing avatar to delete
      if (currentAvatarData[0].avatar_file_name) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([currentAvatarData[0].avatar_file_name]);

        if (deleteError) {
          throw deleteError;
        }
      }

      setUserProfile({
        ...userProfile,
        avatar_url: publicUrlData.publicUrl,
        avatar_file_name: path,
        email: userProfile?.email || '',
        first_name: userProfile?.first_name || '',
        last_name: userProfile?.last_name || '',
        items: userProfile?.items || [],
      });
    } catch (error: any) {
      console.warn(error);
      Alert.alert(error.message);
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
      <ProfilePicture userId={user?.id} size={size} pressable={false} />
      <Button
        size="sm"
        title="Edit profile picture"
        style={{ width: 'auto' }}
        disabled={!editable || isLoading}
        onPress={() => handleUpdateProfilePicture()}
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
