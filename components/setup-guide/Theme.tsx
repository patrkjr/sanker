import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import { H3, P } from '../typography';
import { Footer } from './Footer';
import Header from './Header';

export default function Theme() {
  return (
    <View style={[DefaultStyles.pageContainer, styles.container]}>
      <Stack.Screen
        options={{
          header: (props) => <Header navigationProps={props} href="../" />,
        }}
      />
      <View style={styles.content}>
        <H3>What theme do you prefer?</H3>
        <P>You can always change this in the app settings.</P>
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
  },
});
