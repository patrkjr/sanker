import { timingConfig } from '@/constants/Animations';
import FontScale from '@/constants/FontScale';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import React, { forwardRef } from 'react';
import type { View, ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Large, P } from '../typography';

interface ButtonProps {
  title: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  variant?: 'default' | 'themed' | 'destructive';
  ghost?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const Button = forwardRef<View, ButtonProps>(
  (
    {
      title,
      variant = 'default',
      ghost = false,
      disabled = false,
      style,
      size = 'md',
      onPress,
      onPressOut,
      onPressIn,
    },
    ref
  ) => {
    const colors = useThemedColors();
    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    });

    function handlePressIn() {
      if (onPress) {
        opacity.value = withTiming(0.8, timingConfig.md);
        scale.value = withTiming(0.94, timingConfig.md);
      }
      onPressIn?.();
    }

    function handlePressOut() {
      if (onPress) {
        opacity.value = withTiming(1, timingConfig.md);
        scale.value = withTiming(1, timingConfig.md);
      }
      onPressOut?.();
    }

    const variantStyles = {
      default: {
        solid: {
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.text,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: colors.text,
        },
      },
      themed: {
        solid: {
          backgroundColor: colors.themed.card,
          borderColor: colors.themed.border,
          color: colors.themed.text,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: colors.themed.text,
        },
      },
      destructive: {
        solid: {
          backgroundColor: colors.descructive.background,
          borderColor: colors.descructive.border,
          color: colors.descructive.text,
        },
        ghost: {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: colors.descructive.text,
        },
      },
    };

    const sizeStyles = {
      sm: {
        minWidth: 64,
        paddingHorizontal: Spacings.md,
        paddingVertical: Spacings.xs,
      },
      md: {
        width: '100%' as const,
        paddingHorizontal: Spacings.lg,
        paddingVertical: ghost ? Spacings.xxs : Spacings.sm,
      },
    };

    const disabledStyle = {
      backgroundColor: ghost ? 'transparent' : colors.cardDisabled,
      borderColor: 'transparent',
      opacity: 0.5,
    };

    const Text = size === 'sm' ? P : Large;
    const currentVariantStyle =
      variantStyles[variant][ghost ? 'ghost' : 'solid'];

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          ref={ref}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.base,
            sizeStyles[size],
            currentVariantStyle,
            disabled && disabledStyle,
            style,
          ]}
          disabled={disabled}
          onPress={onPress}
        >
          <Text
            bold
            style={[
              {
                color: currentVariantStyle.color,
                fontSize: size === 'sm' ? FontScale.md : FontScale.lg,
                fontFamily: 'Nunito-ExtraBold',
                textAlign: 'center',
              },
              disabled && { color: colors.textPlaceholder },
            ]}
          >
            {title}
          </Text>
        </Pressable>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: Spacings.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
