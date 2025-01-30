import { timingConfig } from '@/constants/Animations';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, Pressable } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function ImageItem({
  item,
  index,
  size = 100,
  offset = 20,
  shouldAnimate = true,
  onDrag,
  onRemoveImage,
}: {
  item: { uri: string };
  index: number;
  size?: number;
  offset: number;
  shouldAnimate: boolean;
  onDrag: (translationX: number, index: number, finalize: boolean) => void;
  onRemoveImage: (index: number) => void;
}) {
  const colors = useThemedColors();

  const translationX = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue('0deg');
  const zIndex = useSharedValue(0);

  useAnimatedReaction(
    () => {
      return offset;
    },
    (currentValue, previousValue) => {
      offsetX.value = withTiming(currentValue, timingConfig.md);
    }
  );

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(250)
    .onStart((e) => {
      scale.value = 1.16;
      // Slight randomization
      // rotation.value = (Math.floor(Math.random() * 15) - 7).toString() + 'deg';
      rotation.value = '6deg';
      zIndex.value = 2;
    })
    .onUpdate((e) => {
      onDrag(index, e.translationX, false);
      translationX.value = e.translationX;
    })
    .onEnd((e) => {
      scale.value = 1;
      zIndex.value = 0;
      rotation.value = '0deg';
      onDrag(index, e.translationX, true);
    })
    .onFinalize((e) => {
      translationX.value = withTiming(0, timingConfig.md);
    })
    //This should probably be changed to run on UI in the future.
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      zIndex: zIndex.value,
      transform: [
        { translateX: translationX.value + offsetX.value },
        { scale: withTiming(scale.value, timingConfig.overshot) },
        { rotate: withTiming(rotation.value, timingConfig.overshot) },
      ],
    };
  });

  //Disabled gesture by removing the GestureDetector component
  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: colors.cardDisabled,
          borderRadius: Spacings.borderRadius.md,
          overflow: 'hidden',
        },
        animatedStyle,
      ]}
    >
      <Pressable
        style={{
          position: 'absolute',
          zIndex: 1,
          right: Spacings.sm,
          top: Spacings.sm,
        }}
        onPress={() => onRemoveImage(index)}
      >
        {/* Disabled trash icon */}
        {/* <View
          style={{
            backgroundColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon name="Trash2" color={'#ffffff'} />
        </View> */}
      </Pressable>
      <Image style={styles.image} source={item.uri} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
});
