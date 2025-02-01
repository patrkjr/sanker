import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import { H1, Large, P } from '../typography';
import Button from '../ui/Button';
import PageScrollView from '../ui/PageScrollView';

export default function Onboarding() {
  const { pageContainer } = DefaultStyles;
  return (
    <PageScrollView>
      <View style={pageContainer}>
        <View
          style={{
            flexDirection: 'column-reverse',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <H1 style={{ textAlign: 'center' }}>Adventure awaits!</H1>
          <Large secondary bold>
            This is Sanker
          </Large>
        </View>
        <P style={{ textAlign: 'center' }}>
          Welcome to Sanker. We're excited to help you on your journey. Let's
          get started by setting up your profile and preferences to create the
          best experience for you.
        </P>
        <Link href="/onboarding/profile-picture" asChild>
          <Button title="Learn Sanker" variant="themed" size="md" />
        </Link>
        <Link href="../" relativeToDirectory push asChild>
          <Button title="Lets get started" ghost />
        </Link>
      </View>
    </PageScrollView>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    alignSelf: 'flex-end',
    gap: Spacings.md,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
