import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Link, Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import { H3, P } from '../typography';
import Button from '../ui/Button';
import Header from './Header';

export default function Done() {
  const router = useRouter();

  function handleDismiss() {
    router.dismissAll();
    router.back();
  }

  return (
    <View style={[DefaultStyles.pageContainer, styles.container]}>
      <Stack.Screen
        options={{
          header: (props) => <Header navigationProps={props} href="../" />,
        }}
      />
      <View style={styles.content}>
        <H3>All done!</H3>
        <P style={{ textAlign: 'center' }}>
          Welcome to Sanker. We're excited to help you on your journey. Lets get
          started by setting up your profile and preferences to create the best
          experience for you.
        </P>
        <Link href="/" asChild>
          <Button
            title="Start using Sanker"
            variant="themed"
            size="md"
            onPress={handleDismiss}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacings.md,
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: Spacings.xxl * -1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacings.lg,
  },
});
