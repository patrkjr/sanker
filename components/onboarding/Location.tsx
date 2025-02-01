import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
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
      <View style={styles.content}>
        <H3>Location privacy</H3>
        <P>
          These settings will only be applied as a default, when you make
          listings. You can change them for each listing you create.
        </P>
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
