import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import ProfileCard from '../profile/ProfileCard';
import { H3, P } from '../typography';
import Button from '../ui/Button';
import { Footer } from './Footer';
import Header from './Header';

export default function ProfilePicture() {
  const { user } = useSupabase();

  return (
    <View style={[DefaultStyles.pageContainer, styles.container]}>
      <Stack.Screen
        options={{
          header: (props) => <Header navigationProps={props} href="../" />,
        }}
      />
      <View style={styles.content}>
        <H3>This is how you'll appear to others in the app</H3>
        <ProfileCard profileId={user?.id ?? ''} />
        <View style={{ alignSelf: 'center', backgroundColor: 'transparent' }}>
          <Button title="Upload picture" />
        </View>
        <P>
          Having a clear profile picture will help your buyers feel more safe,
          leading to more sales.
        </P>
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
  navigation: {
    paddingVertical: Spacings.md,
    gap: Spacings.md,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
