import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import usePreferencesStore from '@/stores/preferenceStore';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from '../Themed';
import { Label } from '../typography';
import Card from '../ui/Card';
import Item from '../ui/Item';

export default function ThemePreferences() {
  const { userPreferences, setPreferences } = usePreferencesStore();
  const preferredTheme = userPreferences.theme;

  function handleUpdatePreferredTheme(theme: 'light' | 'dark' | 'system') {
    setPreferences({ theme });
  }

  return (
    <ScrollView contentContainerStyle={pageContainer}>
      <View style={{ gap: Spacings.sm }}>
        <Label>Preferred theme</Label>
        <Card>
          <Item onPress={() => handleUpdatePreferredTheme('light')}>
            <Item.Label>Light</Item.Label>
            <Item.Value
              hasTrailingIcon={preferredTheme === 'light'}
              trailingIconName="Check"
            ></Item.Value>
          </Item>
          <Item onPress={() => handleUpdatePreferredTheme('dark')}>
            <Item.Label>Dark</Item.Label>
            <Item.Value
              hasTrailingIcon={preferredTheme === 'dark'}
              trailingIconName="Check"
            ></Item.Value>
          </Item>
          <Item onPress={() => handleUpdatePreferredTheme('system')} isLastItem>
            <Item.Label>Follow system</Item.Label>
            <Item.Value
              hasTrailingIcon={preferredTheme === 'system'}
              trailingIconName="Check"
            ></Item.Value>
          </Item>
        </Card>
      </View>
    </ScrollView>
  );
}

const { pageContainer } = DefaultStyles;
// const styles = StyleSheet.create({
//   pageContainer: {
//     paddingHorizontal: Spacings.md,
//     paddingVertical: Spacings.md,
//   },
// });
