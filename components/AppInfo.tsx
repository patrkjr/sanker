import Spacings from '@/constants/Spacings';
import { View } from './Themed';
import { H4, Mono, P } from './typography';

export default function AppInfo() {
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
        <Mono secondary>v0.1</Mono>
      </View>
      <P bold secondary>
        Kechu studio
      </P>
    </View>
  );
}
