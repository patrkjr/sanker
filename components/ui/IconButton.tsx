import Colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { useButtonAnimation } from '@/hooks/useButtonAnimation';
import { useThemedColors } from '@/hooks/useThemedColors';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import Icon from './Icon';

const ICON_SIZE = 44;

interface IconButtonProps {
  name: string;
  onPress?: () => void;
  theme?: 'light' | 'dark';
  disabled?: boolean;
}

export default function IconButton({
  name,
  onPress,
  theme,
  disabled,
}: IconButtonProps) {
  const colors = useThemedColors();
  const backgroundColor = theme ? Colors[theme].card : colors.card;
  const iconColor = theme ? Colors[theme].text : undefined;

  const { animatedStyle, handlePressIn, handlePressOut } = useButtonAnimation({
    disabled,
  });

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[{ backgroundColor }, styles.container]}
      >
        <Icon name={name} color={iconColor} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacings.borderRadius.round,
  },
});
