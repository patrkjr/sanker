import Spacings from '@/constants/Spacings';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from '../Themed';
import { H2 } from '../typography';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function Welcome() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          gap: Spacings.md,
          padding: Spacings.sm,
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Card style={{ alignItems: 'center', gap: Spacings.md }}>
          <H2>Welcome to Sanker</H2>
          <Link href={'/auth/signup'} asChild>
            <Button title="Sign up to Sanker" />
          </Link>
          <Link href={'/'} replace asChild>
            <Button title="Use wihtout account" />
          </Link>
        </Card>
      </View>
    </SafeAreaView>
  );
}
