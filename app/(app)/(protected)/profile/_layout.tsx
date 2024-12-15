import { Stack, useLocalSearchParams } from 'expo-router';
import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';

export default function ProfileLayout() {
  const { title } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Profile', ...HeaderLargeStyle }}
      />
      <Stack.Screen
        name="account-settings"
        options={{
          title: 'Edit profile',
          ...HeaderLargeStyle,
        }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          title: 'Item for sale',
          ...HeaderStyle,
        }}
      />
      <Stack.Screen
        name="edit-name"
        options={{
          title: 'Edit name',
          presentation: 'modal',
          ...HeaderLargeStyle,
        }}
      />
      <Stack.Screen
        name="listings"
        options={{ title: 'My listings', ...HeaderLargeStyle }}
      />
    </Stack>
  );
}
