import { timingConfig } from '@/constants/Animations';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import * as Haptics from 'expo-haptics';
import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ViewProps } from '../Themed';

interface CardProps extends PropsWithChildren {
  borderLess?: boolean;
  variant?: 'default' | 'themed' | 'warning';
  style?: ViewStyle | ViewStyle[] | [];
  onPress?: (() => void) | undefined;
  useHaptics?: boolean;
  otherProps?: ViewProps;
}

export default function Card({
  children,
  borderLess = false,
  variant = 'default',
  style,
  useHaptics = true,
  onPress = undefined,
  ...otherProps
}: CardProps) {
  const colors = useThemedColors();

  function getCardStyle() {
    const baseCardStyle: ViewStyle[] = [
      { ...styles.baseCardStyle },
      {
        backgroundColor: colors.card,
        borderColor: colors.border,
      },
    ];
    if (variant === 'themed') {
      baseCardStyle.push({
        backgroundColor: colors.themed.card,
        borderColor: colors.themed.border,
      });
    }
    if (variant === 'warning') {
      baseCardStyle.push({
        backgroundColor: colors.warning.background,
        borderColor: colors.warning.border,
      });
    }

    if (borderLess) {
      baseCardStyle.push({ borderWidth: 0 });
    }

    return baseCardStyle;
  }

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
        style={[...getCardStyle(), style, animatedCardStyle]}
        {...otherProps}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseCardStyle: {
    borderWidth: 1,
    borderRadius: Spacings.borderRadius.md,
    paddingVertical: Spacings.xs,
    paddingHorizontal: Spacings.md,
    width: '100%',
    overflow: 'hidden',
  },
});
