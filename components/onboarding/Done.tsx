import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import { Link, Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import { H3, P } from '../typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
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
          That's all there is to it. You're all set to start using Sanker.
        </P>
        <Link href="/" asChild>
          <Button
            title="Start using Sanker"
            variant="themed"
            size="md"
            onPress={handleDismiss}
          />
        </Link>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: Spacings.lg,
          }}
        >
          <Card>
            <P style={{ textAlign: 'center' }} secondary>
              You can find additional settings under{' '}
              <P bold secondary>
                preferences
              </P>{' '}
              in your profile.
            </P>
          </Card>
        </View>
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
    marginTop: Spacings.xl,
    alignItems: 'center',
    gap: Spacings.lg,
  },
});
