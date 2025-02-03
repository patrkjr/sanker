import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import NotificationPreferences from '../profile/user-preferences/NotificationPreferences';
import { H3, P } from '../typography';
import { Footer } from './Footer';
import Header from './Header';

export default function Notifications() {
  return (
    <View style={[DefaultStyles.pageContainer, styles.container]}>
      <Stack.Screen
        options={{
          header: (props) => <Header navigationProps={props} href="../" />,
        }}
      />
      <View style={styles.content}>
        <View style={{ paddingHorizontal: Spacings.md, gap: Spacings.sm }}>
          <H3>Get notified</H3>
          <P>
            Turn on notifications to make sure you see, when someone is
            interested in your listing.
          </P>
        </View>
        <NotificationPreferences />
      </View>
      <Footer href="./location" />
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
});
