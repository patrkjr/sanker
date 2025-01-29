import FontScale from '@/constants/FontScale';
import Spacings from '@/constants/Spacings';
import { useButtonAnimation } from '@/hooks/useButtonAnimation';
import { useThemedColors } from '@/hooks/useThemedColors';
import React, { forwardRef } from 'react';
import type { View, ViewStyle } from 'react-native';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { Large } from '../typography';

interface ButtonProps {
  title: string;
  disabled?: boolean;
  size: 'sm' | 'md';
  variant: 'default' | 'themed' | 'descructive';
  ghost?: boolean;
  themed?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

const Button = forwardRef<View, ButtonProps>(
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
    const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation(
      {
        disabled,
      }
    );

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

    const descructiveStyle = {
      backgroundColor: colors.descructive.background,
      borderColor: colors.descructive.border,
    };

    const descructiveTextStyle = {
      color: colors.descructive.text,
    };

    return (
      <Animated.View style={animatedStyle}>
        <Pressable
          ref={ref}
          onPressIn={() => {
            handlePressIn();
            onPressIn?.();
          }}
          onPressOut={() => {
            handlePressOut();
            onPressOut?.();
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
