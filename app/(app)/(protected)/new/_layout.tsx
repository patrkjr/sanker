import { Stack } from "expo-router";
import HeaderLargeStyle from "@/constants/HeaderStyle";

export default function NewLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Create", ...HeaderLargeStyle }}
      />
      <Stack.Screen name="success" options={{ presentation: "modal", headerShown: false }}/>
    </Stack>
  );
}
