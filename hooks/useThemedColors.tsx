import { useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

export function useThemedColors() {
  const theme = useColorScheme() || "light";
  return Colors[theme];
}
