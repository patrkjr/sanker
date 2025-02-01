import Spacings from '@/constants/Spacings';
import { useListItemAnimation } from '@/hooks/useListItemAnimation';
import { useThemedColors } from '@/hooks/useThemedColors';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import type { LinkComponent } from 'expo-router/build/link/Link';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { View } from '../Themed';
import { P } from '../typography';
import Icon from './Icon';

interface ItemProps {
  label: string;
  value?: string;
  href?: LinkComponent;
  relativeToDirectory?: boolean;
  hasTrailingIcon?: boolean;
  leadingIconName?: string;
  trailingIconName?: string;
  animate?: boolean;
  disabled?: boolean;
  isLastItem?: boolean;
  push?: boolean;
  skeleton?: boolean;
  onPress?: () => void;
  useHaptics: boolean;
  children: ChildNode;
  trailingIcon?: JSX.Element;
}

export default function Item({
  onPress,
  isLastItem = false,
  href,
  relativeToDirectory = false,
  useHaptics = true,
  disabled = false,
  animate = true,
  skeleton = false,
  children,
  push = false,
}: ItemProps) {
  const colors = useThemedColors();

  const { animatedStyle, handlePressIn, handlePressOut } = useListItemAnimation(
    {
      disabled,
      animate,
    }
  ) as {
    animatedStyle: ViewStyle;
    handlePressIn: () => void;
    handlePressOut: () => void;
  };

  function handleOnPress() {
    if (useHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  }

  const content = (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || skeleton}
      onPress={onPress && handleOnPress}
    >
      <Animated.View
        style={[
          {
            borderColor: colors.border,
            borderBottomWidth: 1,
            height: 60,
          },
          isLastItem && { borderBottomWidth: 0 },
          styles.container,
          animatedStyle,
        ]}
      >
        {!skeleton ? (
          children
        ) : (
          <View
            style={[
              styles.skeletonBox,
              { backgroundColor: colors.textSecondary },
            ]}
          />
        )}
      </Animated.View>
    </Pressable>
  );

  if (href) {
    return (
      <Link
        href={href}
        relativeToDirectory={relativeToDirectory}
        push={push}
        asChild
      >
        {content}
      </Link>
    );
  }

  return content;
}

const Value = ({
  children,
  hasTrailingIcon = true,
  trailingIconName = 'ChevronRight',
}) => {
  return (
    <View style={styles.valueContainer}>
      <P bold>{children}</P>
      {hasTrailingIcon && <Icon name={trailingIconName} />}
    </View>
  );
};

Item.Label = P;
Item.Value = Value;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: Spacings.xxxl,
    paddingVertical: Spacings.md,
    backgroundColor: 'transparent',
  },
  valueContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacings.xxs,
  },
  skeletonBox: {
    height: 20,
    width: 90,
    opacity: 0.3,
    borderRadius: Spacings.borderRadius.sm,
  },
});
