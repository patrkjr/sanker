import { supabase } from '@/config/supabase';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { compressImage } from '@/utils/compressImage';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert } from 'react-native';

interface UseImageUpload {
  handleUpdateProfilePicture: () => Promise<void>;
  isLoading: boolean;
}

export function useImageUpload(): UseImageUpload {
  const [isLoading, setIsLoading] = useState(false);

  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

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
        return;
      }

      setIsLoading(true);
      const image = result.assets[0];

      if (!image.uri) {
        throw new Error('No image uri!');
      }

      const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg';
      const path = `${Date.now()}.${fileExt}`;

      const compressedImage = await compressImage(image.uri, 500);

      const arraybuffer = await fetch(compressedImage.uri).then((res) =>
        res.arrayBuffer()
      );

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? 'image/jpeg',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = await supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData || !userData.user) {
        throw new Error('Failed to retrieve user data');
      }
      const userId = userData.user.id;

      const { data: currentAvatarData, error: currentAvatarError } =
        await supabase
          .from('users')
          .select('avatar_file_name')
          .eq('id', userId);

      if (currentAvatarError) {
        throw currentAvatarError;
      }

      const { data: avatarData, error: avatarError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrlData.publicUrl, avatar_file_name: path })
        .eq('id', userId)
        .select('avatar_url, avatar_file_name');

      if (avatarError) {
        throw avatarError;
      }

      if (currentAvatarData[0].avatar_file_name) {
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove([currentAvatarData[0].avatar_file_name]);

        if (deleteError) {
          throw deleteError;
        }
      }

      // Fetch the updated profile from Supabase
      const { data: updatedProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Update the user profile in the store
      setUserProfile(updatedProfile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn(error);
        Alert.alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { handleUpdateProfilePicture, isLoading };
}
