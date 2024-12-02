import { Pressable, StyleSheet } from "react-native";
import { View } from "../Themed";
import Spacings from "@/constants/Spacings";
import { useThemedColors } from "@/hooks/useThemedColors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { timingConfig } from "@/constants/Animations";
import { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";

const WIDTH = 40;
const HEIGHT = 24;
const THUMB_SIZE = 20;

export default function Switch({
  selected = false,
  disabled = false,
  onPress,
  ...otherProps
}) {
  //Use this to check for initial render
  const initialRender = useRef(true);

  const colors = useThemedColors();

  const thumbPosition = useSharedValue(selected ? WIDTH - THUMB_SIZE - 4 : 0);
  const backgroundColor = useSharedValue(
    selected ? colors.primary : colors.cardDisabled,
  );

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    // This will not run on inital render because of early return above
    thumbPosition.value = withTiming(
      selected ? WIDTH - THUMB_SIZE - 4 : 0,
      timingConfig.md,
    );
    backgroundColor.value = withTiming(
      selected ? colors.primary : colors.cardDisabled,
      timingConfig.md,
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [selected, colors]);

  const handlePress = () => {
    if (!disabled) {
      onPress?.();
    }
  };

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: thumbPosition.value }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[styles.container, animatedContainerStyle]}
        {...otherProps}
      >
        <Animated.View
          style={[
            {
              backgroundColor: !disabled ? colors.thumb : colors.thumbDisabled,
            },
            styles.thumb,
            animatedThumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingHorizontal: 2,
    borderRadius: Spacings.borderRadius.round,
    width: WIDTH,
    height: HEIGHT,
  },
  thumb: {
    borderRadius: Spacings.borderRadius.round,
    height: THUMB_SIZE,
    width: THUMB_SIZE,
  },
});
