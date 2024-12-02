import Spacings from "@/constants/Spacings";
import { View } from "../Themed";
import { Mono, Small } from "../typography";
import Card from "./Card";
import { Pressable, PressableProps, StyleSheet } from "react-native";
import FontScale from "@/constants/FontScale";
import { useThemedColors } from "@/hooks/useThemedColors";
import { useEffect, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { timingConfig, springConfig } from "@/constants/Animations";
import * as Haptics from "expo-haptics";

interface TagProps extends PressableProps {
  text: string;
  mono?: boolean;
  showSelectable?: boolean;
  selected?: boolean;
}

const THUMB_SIZE = 12;
const DOT_SIZE = 4;

// This is only the inner thumb of the component
const SelectableThumb = ({ selected, style }) => {
  //Use this to check for initial render
  const initialRender = useRef(true);

  const colors = useThemedColors();

  const dotSize = useSharedValue(selected ? DOT_SIZE : 0);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    // This will not run on inital render because of early return above
    dotSize.value = withSpring(selected ? DOT_SIZE : 0, springConfig.quick);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [colors, selected]);

  const animatedDotStyle = useAnimatedStyle(() => {
    return {
      height: dotSize.value,
      width: dotSize.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.thumbBase,
        { borderColor: colors.thumbBackground },
        selected && { borderWidth: 0, backgroundColor: colors.primary },
        style,
      ]}
    >
      {selected && (
        <Animated.View
          style={[
            {
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: Spacings.borderRadius.round,
              backgroundColor: colors.thumb,
            },
            animatedDotStyle,
          ]}
        />
      )}
    </Animated.View>
  );
};

// This is the main part of the component
export default function SelectableTag({
  text,
  onPress,
  selected = false,
  showSelectable = true,
  mono = false,
  tabIndex,
}: TagProps) {

  const colors = useThemedColors();

  const scale = useSharedValue(1);

  const animatedThumb = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.94, timingConfig.md);
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, timingConfig.md);
  };

  return (
    <Pressable
      onPress={onPress}
      tabIndex={tabIndex}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Card
        style={[
          styles.card,
          selected && {
            backgroundColor: colors.themed.card,
            borderColor: colors.themed.border,
          },
          onPress && animatedThumb,
        ]}
      >
        {showSelectable && <SelectableThumb selected={selected} />}
        {mono ? (
          <Mono secondary style={[selected && { color: colors.themed.text }]}>{text}</Mono>
        ) : (
          <Small bold style={[selected && { color: colors.themed.text }]}>
            {text}
          </Small>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: "flex-start",
    flexDirection: "row",
    width: "auto",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacings.xs,
  },
  text: {
    fontSize: FontScale.md,
  },
  thumbBase: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacings.borderRadius.round,
    borderWidth: 1,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
});
