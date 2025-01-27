import { timingConfig } from '@/constants/Animations';
import { red } from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProgressWidgetStore } from '../../stores/progressWidgetStore';
import { View } from '../Themed';
import { Small } from '../typography';

//const DRAG_HEIGHT = 152;
const WIDGET_HEIGHT = 56; // Define the widget height as a constant

const ProgressWidget: React.FC = () => {
  const { message, isVisible, isDismissible, hideWidget, progress, error } =
    useProgressWidgetStore();
  const translateY = useSharedValue(-100);
  const insets = useSafeAreaInsets();
  const dismissThreshold = -50; // Define a threshold for dismissing
  const progressWidth = useSharedValue(0);

  const colors = useThemedColors();

  const DRAG_HEIGHT = WIDGET_HEIGHT + insets.top;

  React.useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0);
    } else {
      translateY.value = withSpring(DRAG_HEIGHT * -1);
    }
  }, [isVisible, translateY, DRAG_HEIGHT]);

  React.useEffect(() => {
    if (progress === 100 || error) {
      const timeoutId = setTimeout(() => {
        translateY.value = withSpring(-DRAG_HEIGHT, {}, () =>
          runOnJS(hideWidget)()
        );
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [progress, error, translateY, DRAG_HEIGHT, hideWidget]);

  React.useEffect(() => {
    progressWidth.value = withTiming(progress, timingConfig.md);
  }, [progress, progressWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Initialize the start position
    })
    .onUpdate((event) => {
      // Make the widget dismissible if there's an error
      const canDismiss = isDismissible || !!error;
      if (canDismiss) {
        if (event.translationY > 0) {
          // Apply elastic effect when dragging down
          translateY.value = event.translationY * 0.1;
        } else {
          // Follow user interaction when dragging up
          translateY.value = event.translationY;
        }
      } else {
        // Apply elastic effect for both directions when not dismissible
        translateY.value = event.translationY * 0.1;
      }
    })
    .onEnd((event) => {
      const canDismiss = isDismissible || !!error;
      if (canDismiss && event.translationY < dismissThreshold) {
        translateY.value = withSpring(-DRAG_HEIGHT, {}, () =>
          runOnJS(hideWidget)()
        );
      } else {
        translateY.value = withSpring(0); // Return to original position
      }
    });

  if (!isVisible) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.widget,
            animatedStyle,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              marginTop: insets.top,
            },
          ]}
        >
          <Small style={{ textAlign: 'center' }}>{error || message}</Small>
          <Animated.View
            style={[
              styles.progressBar,
              progressBarStyle,
              { backgroundColor: error ? red[500] : colors.primary },
            ]}
          />
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  widget: {
    width: 180,
    borderWidth: StyleSheet.hairlineWidth,
    height: WIDGET_HEIGHT,
    padding: 16,
    borderRadius: Spacings.borderRadius.round,
    justifyContent: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 2,
    marginTop: 8,
  },
});

export default ProgressWidget;
