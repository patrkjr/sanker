import { Stack } from 'expo-router';
import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Featured', ...HeaderLargeStyle }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          headerTitle: '',
          title: 'Item for sale',
          ...HeaderStyle,
        }}
      />
    </Stack>
  );
}
