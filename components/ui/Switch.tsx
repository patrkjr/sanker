import { timingConfig } from '@/constants/Animations';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const WIDTH = 40;
const HEIGHT = 24;
const THUMB_SIZE = 20;

const SIZES = {
  sm: {
    WIDTH: 40,
    HEIGHT: 24,
    THUMB_SIZE: 20,
  },
  md: {
    WIDTH: 52,
    HEIGHT: 32,
    THUMB_SIZE: 28,
  },
};

interface SwitchProps {
  selected?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  useHaptics?: boolean;
  onPress?: () => void;
}

export default function Switch({
  selected = false,
  disabled = false,
  size = 'md',
  useHaptics = true,
  onPress,
  ...otherProps
}: SwitchProps) {
  //Use this to check for initial render

  const { WIDTH, HEIGHT, THUMB_SIZE } = SIZES[size];

  const initialRender = useRef(true);

  const colors = useThemedColors();

  const thumbPosition = useSharedValue(selected ? WIDTH - THUMB_SIZE - 4 : 0);
  const backgroundColor = useSharedValue(
    selected ? colors.primary : colors.cardDisabled
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    // This will not run on inital render because of early return above
    thumbPosition.value = withTiming(
      selected ? WIDTH - THUMB_SIZE - 4 : 0,
      timingConfig.md
    );
    backgroundColor.value = withTiming(
      selected ? colors.primary : colors.cardDisabled,
      timingConfig.md
    );
    if (useHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [selected, colors]);

  const handlePress = () => {
    if (!disabled) {
      onPress?.();
    }
  };

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: thumbPosition.value }],
      width: THUMB_SIZE,
      height: THUMB_SIZE,
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
      width: WIDTH,
      height: HEIGHT,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[styles.container, animatedContainerStyle]}
        {...otherProps}
      >
        <Animated.View
          style={[
            {
              backgroundColor: !disabled ? colors.thumb : colors.thumbDisabled,
            },
            styles.thumb,
            animatedThumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderRadius: Spacings.borderRadius.round,
    width: WIDTH,
  },
  thumb: {
    borderRadius: Spacings.borderRadius.round,
    height: THUMB_SIZE,
    width: THUMB_SIZE,
  },
});
