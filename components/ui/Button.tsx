import React, { forwardRef } from 'react';
import { Pressable, useColorScheme, ViewStyle } from 'react-native';
import { Large } from '../typography';
import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { timingConfig } from '@/constants/Animations';

interface ButtonProps {
  title: string;
  disabled?: boolean;
  ghost?: boolean;
  themed?: boolean;
  onPress?: () => void;
  [key: string]: any; // Allow other props for Pressable
}

const Button = forwardRef(
  (
    {
      title,
      themed = false,
      ghost = false,
      disabled = false,
      onPress,
      ...otherProps
    }: ButtonProps,
    ref
  ) => {
    const theme = useColorScheme() || 'light';
    const colors = Colors[theme];

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
      paddingHorizontal: Spacings.md,
      borderRadius: Spacings.borderRadius.round,
      borderWidth: 1,
      borderColor: themed ? colors.themed.border : colors.border,
    };

    const textStyle = {
      color: themed ? colors.themed.text : colors.text,
      fontWeight: '800',
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

    return (
      <Animated.View style={animatedButtonStyle}>
        <Pressable
          ref={ref}
          {...otherProps}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[wrapperStyle, ghost && ghostStyle, disabled && disabledStyle]}
          disabled={disabled}
          onPress={onPress}
        >
          <Large
            bold
            style={[textStyle, ghost && ghostText, disabled && disabledText]}
          >
            {title}
          </Large>
        </Pressable>
      </Animated.View>
    );
  }
);

export default Button;
