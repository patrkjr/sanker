import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import LocationPreferences from '../profile/user-preferences/LocationPreferences';
import { H3, P } from '../typography';
import { Footer } from './Footer';
import Header from './Header';

export default function Location() {
  return (
    <View style={[DefaultStyles.pageContainer, styles.container]}>
      <Stack.Screen
        options={{
          header: (props) => <Header navigationProps={props} href="../" />,
        }}
      />
      <View style={{ gap: Spacings.md }}>
        <View style={styles.content}>
          <H3>Location privacy</H3>
          <P>
            When using Sanker, you have full control over your location privacy.
            You can choose to share your location with others or keep it
            private.
          </P>
        </View>
        <LocationPreferences />
      </View>
      <Footer href="./done" />
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
    paddingHorizontal: Spacings.md,
  },
});
