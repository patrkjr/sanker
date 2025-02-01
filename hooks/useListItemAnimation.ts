import { timingConfig } from '@/constants/Animations';
import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface UseListItemAnimationProps {
  disabled?: boolean;
  animate?: boolean;
}

interface UseListItemAnimationReturn {
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  handlePressIn: () => void;
  handlePressOut: () => void;
}

export function useListItemAnimation({
  disabled = false,
  animate = true,
}: UseListItemAnimationProps = {}): UseListItemAnimationReturn {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(scale.value, timingConfig.md) },
        { translateX: withTiming(translateX.value, timingConfig.md) },
      ],
      opacity: disabled ? 0.5 : withTiming(opacity.value, timingConfig.md),
    };
  });

  const handlePressIn = useCallback(() => {
    opacity.value = 0.6;
    if (animate) {
      translateX.value = 12;
      scale.value = 1.03;
    }
  }, [animate, opacity, scale, translateX]);

  const handlePressOut = useCallback(() => {
    opacity.value = 1;
    if (animate) {
      translateX.value = 0;
      scale.value = 1;
    }
  }, [animate, opacity, scale, translateX]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
}
