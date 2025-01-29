import { timingConfig } from '@/constants/Animations';
import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface UseButtonAnimationProps {
  disabled?: boolean;
  pressedOpacity?: number;
  pressedScale?: number;
}

export function useButtonAnimation({
  disabled = false,
  pressedOpacity = 0.8,
  pressedScale = 0.94,
}: UseButtonAnimationProps = {}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    opacity.value = withTiming(pressedOpacity, timingConfig.md);
    scale.value = withTiming(pressedScale, timingConfig.md);
  }, [disabled, pressedOpacity, pressedScale]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;
    opacity.value = withTiming(1, timingConfig.md);
    scale.value = withTiming(1, timingConfig.md);
  }, [disabled]);

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
  };
}
