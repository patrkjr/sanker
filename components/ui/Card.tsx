import { useColorScheme, ViewStyle } from "react-native";
import { View } from "../Themed";
import Colors from "@/constants/Colors";
import Spacings from "@/constants/Spacings";
import { PropsWithChildren } from "react";
import Animated from "react-native-reanimated";

interface CardProps extends PropsWithChildren {
  borderLess?: boolean;
  themed?: boolean;
  style?: ViewStyle;
}

export default function Card({
  children,
  themed = false,
  borderLess = false,
  style,
  ...otherProps
}: CardProps) {
  const theme = useColorScheme() || "light";
  const colors = Colors[theme];

  const cardStyle: ViewStyle = {
    backgroundColor: themed ? colors.themed.card : colors.card,
    borderWidth: borderLess ? 0 : 1,
    borderRadius: Spacings.borderRadius.md,
    borderColor: themed ? colors.themed.border : colors.border,
    paddingVertical: Spacings.xs,
    paddingHorizontal: Spacings.md,
    width: "100%",
  };

  return (
    <Animated.View style={[cardStyle, style]} {...otherProps}>
      {children}
    </Animated.View>
  );
}
