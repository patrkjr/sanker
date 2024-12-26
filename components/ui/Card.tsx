import React from 'react';
import { Pressable, useColorScheme, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { PropsWithChildren } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ViewProps } from '../Themed';
import { timingConfig } from '@/constants/Animations';
import * as Haptics from 'expo-haptics';

interface CardProps extends PropsWithChildren {
  borderLess?: boolean;
  themed?: boolean;
  style: ViewStyle | ViewStyle[] | [];
  onPress?: (() => void) | undefined;
  useHaptics?: boolean;
  otherProps?: ViewProps;
}

export default function Card({
  children,
  themed = false,
  borderLess = false,
  style,
  useHaptics = true,
  onPress = undefined,
  ...otherProps
}: CardProps) {
  const theme = useColorScheme() || 'light';
  const colors = Colors[theme];

  const cardStyle: ViewStyle = {
    backgroundColor: themed ? colors.themed.card : colors.card,
    borderWidth: borderLess ? 0 : 1,
    borderRadius: Spacings.borderRadius.md,
    borderColor: themed ? colors.themed.border : colors.border,
    paddingVertical: Spacings.xs,
    paddingHorizontal: Spacings.md,
    width: '100%',
  };

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, timingConfig.md),
      transform: [{ scale: withTiming(scale.value, timingConfig.md) }],
    };
  });

  function onPressIn() {
    (opacity.value = 0.5), (scale.value = 0.88);
  }

  function onPressOut() {
    if (useHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    opacity.value = 1;
    scale.value = 1;
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPress && onPressIn}
      onPressOut={onPress && onPressOut}
    >
      <Animated.View
        style={[cardStyle, style, animatedCardStyle]}
        {...otherProps}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
