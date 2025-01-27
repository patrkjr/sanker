import Spacings from '@/constants/Spacings';
import Constants from 'expo-constants';
import React from 'react';
import { View } from 'react-native';
import { H4, Mono, P } from './typography';

export default function AppInfo() {
  const version = 'v' + Constants.expoConfig?.version || 'Unknown version';
  const buildNumber = Constants.expoConfig?.extra?.buildVersion || 'N/A';
  return (
    <View
      style={{
        gap: Spacings.md,
        paddingHorizontal: Spacings.md,
        alignItems: 'center',
      }}
    >
      <View style={{ gap: Spacings.xxs, alignItems: 'center' }}>
        <H4 secondary>Sanker</H4>
        <Mono secondary>{version}</Mono>
        {Constants.debugMode && (
          <Mono secondary>Build version {buildNumber}</Mono>
        )}
      </View>
      <P bold secondary>
        Hechu studio
      </P>
    </View>
  );
}
