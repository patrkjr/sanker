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
import { boolean, number } from 'zod';

// This component can be updated to only take needed props
// Right now it takes a whole profile, but only uses names and image url

interface ProfilePictureProps {
  //Missing profile type definition
  profile: {};
  avatarUrl: string;
  size: number;
  isLoading: boolean;
}

export default function ProfilePicture({
  isLoading = false,
  avatarUrl,
  size = 72,
}: ProfilePictureProps) {
  // const user = useUserStore((state) => state.user);
  // const setUser = useUserStore((state) => state.setUser);
  const [pictureUrl, setPictureUrl] = useState(null);

  useEffect(() => {
    if (avatarUrl) {
      downloadImage(avatarUrl);
    }
  }, [avatarUrl]);

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

  //Get the initials from the first and last name (first and last name not yet implemented in supabase)
  // function getInitials() {
  //   if (!profile || !profile.first_name || !profile.last_name) {
  //     return '🥾';
  //   }

  //   const firstInitial = profile.first_name.charAt(0).toUpperCase();
  //   const lastInitial = profile.last_name.charAt(0).toUpperCase();

  //   return firstInitial + lastInitial;
  // }

  const colors = useThemedColors();

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
