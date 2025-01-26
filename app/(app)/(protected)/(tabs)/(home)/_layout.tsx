import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Featured', ...HeaderLargeStyle }}
      />
      {/* <Stack.Screen
        name="item/[id]"
        options={{
          headerTitle: '',
          title: 'Item for sale',
          ...HeaderStyle,
        }}
      /> */}
    </Stack>
  );
}
