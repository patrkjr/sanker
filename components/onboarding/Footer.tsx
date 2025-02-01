import Spacings from '@/constants/Spacings';
import type { LinkProps } from 'expo-router';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../ui/Button';

interface FooterProps {
  href: LinkProps['href'];
}

export function Footer({ href }: FooterProps) {
  const router = useRouter();

  const handleSkip = () => {
    router.dismissAll();
    router.back();
  };

  return (
    <View style={styles.navigation}>
      <Link href={href} asChild>
        <Button title="Continue" themed size="md" />
      </Link>
      <View>
        <Button
          title="Skip guide"
          ghost
          onPress={handleSkip}
          variant="default"
          size="md"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navigation: {
    paddingVertical: Spacings.md,
    gap: Spacings.md,
    justifyContent: 'flex-end',
  },
});
