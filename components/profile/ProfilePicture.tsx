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

// This component can be updated to only take needed props
// Right now it takes a whole profile, but only uses names and image url
export default function ProfilePicture({ profile, size = 72 }) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [pictureUrl, setPictureUrl] = useState(null);

  useEffect(() => {
    if (profile?.avatar_url) {
      downloadImage(profile.avatar_url);
    }
  }, [profile?.avatar_url]);

  async function downloadImage(path: string) {
    try {
      //Download the avatar image
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);

      if (error) {
        throw error;
      }

      //Set the image as URI
      const fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onload = () => {
        setPictureUrl(fr.result as string);
      };
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message);
        Alert.alert(error?.message);
      }
    }
  }

  async function updateProfilePicture() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: false,
        allowsEditing: true,
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

      setUser({ ...user, avatar_url: path });
    } catch (error) {
      console.log(error);
      Alert.alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  }
  //Get the initials from the first and last name (first and last name not yet implemented in supabase)
  function getInitials() {
    if (!profile || !profile.first_name || !profile.last_name) {
      return '🥾';
    }

    const firstInitial = profile.first_name.charAt(0).toUpperCase();
    const lastInitial = profile.last_name.charAt(0).toUpperCase();

    return firstInitial + lastInitial;
  }

  const colors = useThemedColors();

  return (
    <Pressable
      onPress={() => user?.id === profile?.id && updateProfilePicture()}
      disabled={isLoading}
    >
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
              color={Platform.OS === 'ios' ? colors.themed.card : null}
            />
          </View>
        )}
        {pictureUrl ? (
          <Image
            style={{ width: size, height: size }}
            accessibilityLabel="Avatar"
            source={{ uri: pictureUrl }}
          />
        ) : (
          <P bold style={{ textAlign: 'center' }}>
            {getInitials()}
          </P>
        )}
      </View>
    </Pressable>
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
