import { View } from '../Themed';
import React from 'react';
import Card from '../ui/Card';
import Item from '../ui/Item';
import Switch from '../ui/Switch';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';
import usePreferencesStore from '@/stores/preferenceStore';
import DefaultStyles from '@/constants/DefaultStyles';

export default function ThemePreferences() {
  const { userPreferences, setPreferences } = usePreferencesStore();
  const preferredTheme = userPreferences.theme;

  function handleUpdatePreferredTheme(theme: 'light' | 'dark' | 'system') {
    setPreferences({ theme });
  }

  return (
    <ScrollView contentContainerStyle={pageContainer}>
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
