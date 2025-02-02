import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { View } from '../Themed';
import { H1, Large, P } from '../typography';
import Button from '../ui/Button';

const Header = () => {
  return (
    <View
      style={{
        paddingVertical: Spacings.sm,
        paddingHorizontal: Spacings.md,
        justifyContent: 'center',
        alignItems: 'flex-end',
      }}
    >
      <Link href="../" relativeToDirectory asChild>
        <Button size="sm" title="Skip" ghost />
      </Link>
    </View>
  );
};

export default function Onboarding() {
  const { pageContainer } = DefaultStyles;
  return (
    <View style={[pageContainer, { marginTop: Spacings.lg, gap: Spacings.lg }]}>
      <Stack.Screen
        options={{
          header: () => <Header />,
        }}
      />

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
        Welcome to Sanker. We're excited to help you on your journey. Let's get
        started by setting up your profile and preferences to create the best
        experience for you.
      </P>
      <Link href="/onboarding/profile-picture" asChild>
        <Button title="Learn Sanker" variant="themed" />
      </Link>
    </View>
  );
}
