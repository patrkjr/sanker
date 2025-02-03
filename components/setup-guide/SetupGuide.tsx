import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { View } from '../Themed';
import { H1, P } from '../typography';
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

export default function SetupGuide() {
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
        <H1 style={{ textAlign: 'center' }}>Let's get started!</H1>
        {/* <Large secondary bold>
          Let's get started!
        </Large> */}
      </View>
      <P style={{ textAlign: 'center' }}>
        Let's go through some steps to get you started.
      </P>
      <Link href="/setup-guide/profile-picture" asChild>
        <Button title="Setup Sanker" variant="themed" />
      </Link>
    </View>
  );
}
