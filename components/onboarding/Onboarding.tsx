import DefaultStyles from '@/constants/DefaultStyles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { H1, Large, P } from '../typography';
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
      </View>
    </PageScrollView>
  );
}

const styles = StyleSheet.create({});
