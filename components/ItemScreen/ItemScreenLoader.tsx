import React from 'react';
import LoadingShimmer from '../ui/LoadingShimmer';
import Spacings from '@/constants/Spacings';
import { StyleSheet } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';

export default function ItemScreenLoader() {
  return (
    <Animated.View exiting={FadeOut} style={styles.pageContainer}>
      <LoadingShimmer style={{ height: 300 }} />
      <LoadingShimmer style={{ height: 50 }} />
      <LoadingShimmer style={{ height: 50 }} />
      <LoadingShimmer style={{ height: 250 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    marginTop: 48 * 2,
    padding: Spacings.md,
    gap: Spacings.md,
  },
});
