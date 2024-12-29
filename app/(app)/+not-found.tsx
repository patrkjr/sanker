import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { H2 } from '@/components/typography';
import Button from '@/components/ui/Button';
import Spacings from '@/constants/Spacings';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerBackVisible: false }} />
      <View style={styles.container}>
        <H2 style={{ textAlign: 'center' }}>This screen doesn't exist.</H2>

        <Link replace href="/" style={styles.link} asChild>
          <Button title="Go to home screen" />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacings.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
  },
});
