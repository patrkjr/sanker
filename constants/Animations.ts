import { Easing, ReduceMotion } from "react-native-reanimated";

const md = {
  duration: 300,
  easing: Easing.bezier(0.23, 0.78, 0.46, 1),
  reduceMotion: ReduceMotion.System,
};
const overshot = {
  duration: 1000,
  easing: Easing.elastic(3.2),
  reduceMotion: ReduceMotion.System,
};

const quick = {
  mass: 1,
  damping: 16,
  stiffness: 207,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
};

const timingConfig = {
  md,
  overshot,
};

const springConfig = {
  quick,
};

export { timingConfig, springConfig };
