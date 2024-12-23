import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { P } from '../typography';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Spacings from '@/constants/Spacings';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { timingConfig } from '@/constants/Animations';

export default function AddImage({ onPress }) {
  //onPress(() => pickImageAsync());

  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, timingConfig.md),
      transform: [{ scale: withTiming(scale.value, timingConfig.md) }],
    };
  });

  return (
    <Animated.View>
      <Pressable
        onPress={onPress}
        onPressIn={() => ((opacity.value = 0.5), (scale.value = 0.88))}
        onPressOut={() => ((opacity.value = 1), (scale.value = 1))}
      >
        <Card style={[styles.card, animatedCardStyle]}>
          <Icon name="ImagePlus" />
          <P secondary style={{ textAlign: 'center' }}>
            Add image
          </P>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 200,
    gap: Spacings.xxs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
