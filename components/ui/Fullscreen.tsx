import IconButton from '@/components/ui/IconButton';
import Spacings from '@/constants/Spacings';
import { useFullscreenViewStore } from '@/stores/useFullscreenViewStore';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DISMISS_THRESHOLD = 150;

export default function FullscreenView() {
  const { imageUri, hide } = useFullscreenViewStore();
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = useWindowDimensions();

  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleClose = () => {
    // Animate to bottom of screen first
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      {
        duration: 300,
      },
      () => {
        runOnJS(hide)();
        runOnJS(router.back)();
      }
    );
    scale.value = withTiming(0.5, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });
  };

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Apply elastic effect for upward movement
      if (event.translationY < 0) {
        translateY.value = event.translationY / 3;
        scale.value = withSpring(1);
        opacity.value = withSpring(1);
      } else {
        // Normal downward movement
        translateY.value = event.translationY;
        const progress = event.translationY / DISMISS_THRESHOLD;
        scale.value = withSpring(1 - progress * 0.2);
        opacity.value = withSpring(Math.max(0.3, 1 - progress));
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        runOnJS(handleClose)();
      } else {
        translateY.value = withSpring(0);
        scale.value = withSpring(1);
        opacity.value = withSpring(1);
      }
    });

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: 'rgba(0,0,0,0.89)',
    opacity: opacity.value,
  }));

  const closeButtonAnimatedStyle = useAnimatedStyle(() => {
    // Only interpolate opacity for downward movement
    const buttonOpacity =
      translateY.value > 0
        ? interpolate(translateY.value, [0, DISMISS_THRESHOLD * 0.4], [1, 0], {
            extrapolateRight: 'clamp',
          })
        : 1;
    return {
      opacity: buttonOpacity,
    };
  });

  if (!imageUri) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <Animated.View style={[styles.background, backgroundAnimatedStyle]} />
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.closeButton,
            { top: insets.top + Spacings.sm },
            closeButtonAnimatedStyle,
          ]}
        >
          <IconButton name="X" onPress={handleClose} theme="dark" />
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="contain"
            />
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    overflow: 'hidden',
    right: 20,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
