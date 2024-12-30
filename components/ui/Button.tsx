import React, { forwardRef } from 'react';
import { Pressable, useColorScheme, ViewStyle } from 'react-native';
import { Large, P, Small } from '../typography';
import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { timingConfig } from '@/constants/Animations';
import FontScale from '@/constants/FontScale';
import { useThemedColors } from '@/hooks/useThemedColors';

interface ButtonProps {
  title: string;
  disabled?: boolean;
  size: 'sm' | 'md';
  variant: 'default' | 'themed' | 'descructive';
  ghost?: boolean;
  themed?: boolean;
  onPress?: () => void;
  [key: string]: any; // Allow other props for Pressable
}

const Button = forwardRef<typeof Pressable, ButtonProps>(
  (
    {
      title,
      themed = false,
      ghost = false,
      variant = 'default',
      disabled = false,
      style,
      size = 'md',
      onPress,
      onPressOut,
      onPressIn,
      ...otherProps
    },
    ref
  ) => {
    const colors = useThemedColors();

    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const animatedButtonStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    });

    const wrapperStyle = {
      width: '100%',
      backgroundColor: themed ? colors.themed.card : colors.card,
      paddingVertical: Spacings.sm,
      paddingHorizontal: Spacings.lg,
      borderRadius: Spacings.borderRadius.round,
      borderWidth: 1,
      borderColor: themed ? colors.themed.border : colors.border,
    };

    const textStyle = {
      color: themed ? colors.themed.text : colors.text,
      fontSize: size === 'sm' ? FontScale.md : FontScale.lg,
      fontFamily: 'Nunito-ExtraBold',
      textAlign: 'center',
    };

    const ghostStyle = {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      paddingVertical: Spacings.xxs,
      paddingHorizontal: Spacings.xxs,
    };

    const ghostText = {
      color: colors.text,
    };

    const disabledStyle: ViewStyle = {
      backgroundColor: colors.cardDisabled,
      borderColor: 'transparent',
      paddingVertical: Spacings.sm,
      paddingHorizontal: Spacings.md,
    };

    const disabledText = {
      color: colors.textPlaceholder,
    };

    function handlePressIn() {
      if (disabled) {
        return;
      }
      opacity.value = withTiming(0.8, timingConfig.md);
      scale.value = withTiming(0.94, timingConfig.md);
    }

    function handlePressOut() {
      if (disabled) {
        return;
      }
      opacity.value = withTiming(1, timingConfig.md);
      scale.value = withTiming(1, timingConfig.md);
    }

    const descructiveStyle = {
      backgroundColor: colors.descructive.background,
      borderColor: colors.descructive.border,
    };

    const descructiveTextStyle = {
      color: colors.descructive.text,
    };

    return (
      <Animated.View style={animatedButtonStyle}>
        <Pressable
          ref={ref}
          onPressIn={() => {
            handlePressIn();
            onPressIn && onPressIn();
          }}
          onPressOut={() => {
            handlePressOut();
            onPressOut && onPressOut();
          }}
          style={[
            wrapperStyle,
            ghost && ghostStyle,
            variant === 'descructive' && descructiveStyle,
            disabled && disabledStyle,
            style,
          ]}
          disabled={disabled}
          onPress={onPress}
          {...otherProps}
        >
          <Large
            bold
            style={[
              textStyle,
              ghost && ghostText,
              variant === 'descructive' && descructiveTextStyle,
              disabled && disabledText,
            ]}
          >
            {title}
          </Large>
        </Pressable>
      </Animated.View>
    );
  }
);

export default Button;
