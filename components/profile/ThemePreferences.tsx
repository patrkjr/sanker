import { View } from '../Themed';
import React from 'react';
import Card from '../ui/Card';
import Item from '../ui/Item';
import Switch from '../ui/Switch';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';
import usePreferencesStore from '@/stores/preferenceStore';

export default function ThemePreferences() {
  const { userPreferences, setPreferences } = usePreferencesStore();
  const prefferedTheme = userPreferences.theme;

  function handleUpdatePrefferedTheme(theme: 'light' | 'dark' | 'system') {
    setPreferences({ theme });
  }

  return (
    <ScrollView contentContainerStyle={styles.pageContainer}>
      <Card>
        <Item onPress={() => handleUpdatePrefferedTheme('light')}>
          <Item.Label>Light</Item.Label>
          <Item.Value
            hasTrailingIcon={prefferedTheme === 'light'}
            trailingIconName="Check"
          ></Item.Value>
        </Item>
        <Item onPress={() => handleUpdatePrefferedTheme('dark')}>
          <Item.Label>Dark</Item.Label>
          <Item.Value
            hasTrailingIcon={prefferedTheme === 'dark'}
            trailingIconName="Check"
          ></Item.Value>
        </Item>
        <Item onPress={() => handleUpdatePrefferedTheme('system')} isLastItem>
          <Item.Label>Follow system</Item.Label>
          <Item.Value
            hasTrailingIcon={prefferedTheme === 'system'}
            trailingIconName="Check"
          ></Item.Value>
        </Item>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    paddingHorizontal: Spacings.md,
    paddingVertical: Spacings.md,
  },
});
