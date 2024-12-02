import { Image, Pressable, StyleSheet } from 'react-native';
import { View } from '../Themed';
import { Large, P, Small } from '../typography';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Link } from 'expo-router';
import Icon from '../ui/Icon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { timingConfig } from '@/constants/Animations';

const IMAGE_SIZE = 64;

export default function ProductItem({
  children,
  id,
  title,
  price,
  imageUrl,
  ...otherProps
}) {
  const colors = useThemedColors();
  const [pressedState, setPressedState] = useState(false);

  useEffect(() => {
    opacity.value = pressedState ? 0.4 : 1;
  }, [pressedState]);

  const opacity = useSharedValue(1);

  const animatedItemStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, timingConfig.md),
    };
  });

  return (
    <Link href={`/profile/item/${id}`} asChild>
      <Pressable
        onPressIn={() => setPressedState(true)}
        onPressOut={() => setPressedState(false)}
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
            <Icon name="chevron-right" />
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
