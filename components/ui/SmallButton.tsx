import { Pressable, StyleSheet, Text } from 'react-native';
import React, { forwardRef } from 'react';
import { View } from '../Themed';
import { useThemedColors } from '@/hooks/useThemedColors';
import Spacings from '@/constants/Spacings';
import { P } from '../typography';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { timingConfig } from '@/constants/Animations';

interface SmallButtonProps {
  variant?: 'themed' | 'default';
  title: string;
  disabled: boolean;
  onPress?: () => void;
}

const SmallButton = forwardRef<Pressable, SmallButtonProps>(
  ({ variant = 'default', title, onPress, disabled = false }, ref) => {
    const colors = useThemedColors();

    const variantStyles = {
      themed: {
        backgroundColor: colors.themed.card,
        borderColor: colors.primary,
        color: colors.primary,
      },
      default: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        color: colors.text,
      },
    };

    function getButtonStyles() {
      const baseStyle = [{ ...styles.baseBorder, ...styles.baseContainer }];
      baseStyle.push(variantStyles[variant]);
      return baseStyle;
    }

    const variantTextStyles = {
      themed: {
        color: colors.primary,
      },
      default: {
        color: colors.text,
      },
    };

    function getTextStyles() {
      const baseText = [{ ...styles.baseText }];
      baseText.push(variantTextStyles[variant]);
      return baseText;
    }

    const opacity = useSharedValue(1);
    const scale = useSharedValue(1);

    const animatedButtonStyle = useAnimatedStyle(() => {
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
    }

    function handlePressOut() {
      if (onPress) {
        opacity.value = withTiming(1, timingConfig.md);
        scale.value = withTiming(1, timingConfig.md);
      }
    }

    return (
      <Animated.View style={animatedButtonStyle}>
        <Pressable
          pressRetentionOffset={-50}
          ref={ref}
          style={[...getButtonStyles()]}
          disabled={disabled}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <P style={[...getTextStyles()]}>{title}</P>
        </Pressable>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  baseBorder: {
    borderWidth: 1,
    borderRadius: Spacings.borderRadius.round,
  },
  baseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.xs,
  },
  baseText: {
    fontFamily: 'Nunito-ExtraBold',
  },
});

export default SmallButton;
