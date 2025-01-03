import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  FadeOut,
} from 'react-native-reanimated';
import { useThemedColors } from '@/hooks/useThemedColors';
import Spacings from '@/constants/Spacings';

export default function LoadingShimmer({ ...otherProps }) {
  const colors = useThemedColors();
  const shimmerValue = useSharedValue(0);

  // Animate the shimmer effect
  shimmerValue.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: shimmerValue.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.shimmer,
        {
          backgroundColor: colors.cardDisabled,
          borderRadius: Spacings.borderRadius.md,
        },
        animatedStyle,
        otherProps.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  shimmer: {
    // Define the size of the shimmer effect
    width: '100%',
    height: '100%', // Adjust height as needed
  },
});
