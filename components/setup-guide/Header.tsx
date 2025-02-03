import Spacings from '@/constants/Spacings';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { type LinkProps, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import IconButton from '../ui/IconButton';

interface HeaderProps {
  navigationProps: NativeStackHeaderProps;
  href: LinkProps['href'];
}

export default function Header({ navigationProps, href }: HeaderProps) {
  const router = useRouter();
  function handleNavigation() {
    //navigationProps.navigation.navigate(href);
    router.back();
  }

  return (
    <View style={styles.container}>
      <IconButton name="ArrowLeft" onPress={handleNavigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.md,
    paddingTop: Spacings.lg,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
