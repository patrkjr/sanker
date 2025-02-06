import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { useButtonAnimation } from '@/hooks/useButtonAnimation';
import { useThemedColors } from '@/hooks/useThemedColors';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from './Icon';

const BUTTON_SIZE = 44;

interface IconButtonProps {
  name: string;
  onPress?: () => void;
  theme?: 'light' | 'dark';
  disabled?: boolean;
  variant?: 'default' | 'themed' | 'destructive';
  ghost?: boolean;
  size?: number;
}

export default function IconButton({
  name,
  onPress,
  theme,
  disabled,
  variant = 'default',
  ghost = false,
  ...otherProps
}: IconButtonProps) {
  const colors = useThemedColors();
  const backgroundColor = theme ? Colors[theme].card : colors.card;
  const iconColor = theme ? Colors[theme].text : undefined;

  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation({
    disabled,
  });

  const variantStyles = {
    default: {
      backgroundColor: backgroundColor,
      color: iconColor,
    },
    themed: {
      backgroundColor: colors.themed.card,
      color: colors.themed.text,
    },
    destructive: {
      backgroundColor: colors.destructive.background,
      color: colors.destructive.text,
    },
  };

  const currentVariantStyle = variantStyles[variant];

  const disabledStyle = {
    backgroundColor: ghost ? 'transparent' : colors.cardDisabled,
    borderColor: 'transparent',
    opacity: 0.7,
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          {
            backgroundColor: ghost
              ? 'transparent'
              : currentVariantStyle.backgroundColor,
          },
          disabled && disabledStyle,
          styles.container,
        ]}
      >
        <Icon name={name} color={currentVariantStyle.color} {...otherProps} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacings.borderRadius.round,
  },
});
