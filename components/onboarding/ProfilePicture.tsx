import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import ProfileCard from '../profile/ProfileCard';
import { H3, P } from '../typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Footer } from './Footer';
import Header from './Header';

export default function ProfilePicture() {
  const { user } = useSupabase();
  const { handleUpdateProfilePicture } = useImageUpload();

  return (
    <View style={[DefaultStyles.pageContainer, styles.container]}>
      <Stack.Screen
        options={{
          header: (props) => <Header navigationProps={props} href="../" />,
        }}
      />
      <View style={styles.content}>
        <View style={styles.profileContainer}>
          <H3>Add a profile picture</H3>
          <P>This is how you'll appear to others in the app</P>
        </View>
        <ProfileCard profileId={user?.id ?? ''} />
        <View style={{ alignSelf: 'center', backgroundColor: 'transparent' }}>
          <Button
            size="sm"
            title="Upload picture"
            onPress={handleUpdateProfilePicture}
          />
        </View>
        <Card>
          <P secondary>
            Having a clear profile picture will help your buyers feel more safe,
            leading to more sales.
          </P>
        </Card>
      </View>
      <Footer href="./notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacings.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    gap: Spacings.md,
  },
  profileContainer: {
    gap: Spacings.md,
    paddingHorizontal: Spacings.md,
  },
  navigation: {
    paddingVertical: Spacings.md,
    gap: Spacings.md,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
