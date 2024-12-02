import { StyleSheet } from "react-native";
import Icon from "./Icon";
import Spacings from "@/constants/Spacings";
import { useThemedColors } from "@/hooks/useThemedColors";
import { View } from "../Themed";

const ICON_SIZE = 44;

export default function IconButton({ name }) {
  const colors = useThemedColors();

  return (
    <View style={[{ backgroundColor: colors.card }, styles.container]}>
      <Icon name={name} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacings.borderRadius.round,
  },
});
