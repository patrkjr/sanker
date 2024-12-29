import Spacings from '@/constants/Spacings';
import { View } from 'react-native';
import { H4, Mono, P } from './typography';
import Constants from 'expo-constants';

export default function AppInfo() {
  const version = Constants.expoConfig?.version;
  return (
    <View
      style={{
        gap: Spacings.md,
        paddingHorizontal: Spacings.md,
        alignItems: 'center',
      }}
    >
      <View style={{ gap: Spacings.xs, alignItems: 'center' }}>
        <H4 secondary>Sanker</H4>
        <Mono secondary>v{version}</Mono>
      </View>
      <P bold secondary>
        Kechu studio
      </P>
    </View>
  );
}
