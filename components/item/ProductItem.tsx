import { timingConfig } from '@/constants/Animations';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View } from '../Themed';
import { P, Small } from '../typography';
import Icon from '../ui/Icon';

const IMAGE_SIZE = 64;

export default function ProductItem({
  children,
  id,
  title,
  price,
  imageUrl,
  disabled = false,
  animate = true,
  onPress,
  ...otherProps
}) {
  const colors = useThemedColors();
  const [pressedState, setPressedState] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedItemStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(scale.value, timingConfig.md) },
        { translateX: withTiming(translateX.value, timingConfig.md) },
      ],
      opacity: disabled ? 0.5 : withTiming(opacity.value, timingConfig.md),
    };
  });

  return (
    <Link href={`/item/${id}`} asChild>
      <Pressable
        onPressIn={() => (
          (opacity.value = 0.6),
          animate && ((translateX.value = 12), (scale.value = 1.03))
        )}
        onPressOut={() => (
          (opacity.value = 1),
          animate && ((translateX.value = 0), (scale.value = 1))
        )}
        disabled={disabled}
        onPress={onPress}
      >
        <Animated.View
          style={[styles.outerContainer, animatedItemStyle]}
          {...otherProps}
        >
          <View style={styles.valuesContainer}>
            <View style={[styles.imageStyle, { backgroundColor: colors.card }]}>
              <Image
                src={imageUrl}
                style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}
              />
            </View>
            <View>
              <P bold>{title}</P>
              <Small bold secondary>
                {price} kr.
              </Small>
            </View>
          </View>
          <View style={{ padding: Spacings.sm }}>
            <Icon name="ChevronRight" />
          </View>
        </Animated.View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: Spacings.md,
  },
  imageStyle: {
    overflow: 'hidden',
    borderRadius: Spacings.borderRadius.md,
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
  valuesContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacings.sm,
  },
});
