import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import React from 'react';
import { Label, P, Small } from '../typography';
import Card from '../ui/Card';
import Item from '../ui/Item';
import { ScrollView } from 'react-native-gesture-handler';
import DefaultStyles from '@/constants/DefaultStyles';
import Switch from '../ui/Switch';
import Spacings from '@/constants/Spacings';
import usePreferencesStore from '@/stores/preferenceStore';

export default function LocationPreferences() {
  const { userPreferences, setPreferences } = usePreferencesStore();
  const { show_exact_address, use_user_address } = userPreferences.location;

  function handleUpdateLocationPreferences(newLocation: {}) {
    const location = { ...userPreferences.location, ...newLocation };
    setPreferences({ location });
  }

  function updateUseUserAddress() {
    handleUpdateLocationPreferences({
      use_user_address: !use_user_address,
    });
  }

  function updateShowExactAddress() {
    handleUpdateLocationPreferences({
      show_exact_address: !show_exact_address,
    });
  }

  return (
    <ScrollView contentContainerStyle={pageContainer}>
      <View style={styles.defaultsContainer}>
        <Label>Defaults</Label>
        <Card>
          <Item
            useHaptics={false}
            animate={false}
            onPress={updateUseUserAddress}
          >
            <Item.Label>Use my address as location</Item.Label>
            <Item.Value hasTrailingIcon={false}>
              <Switch
                selected={use_user_address}
                onPress={updateUseUserAddress}
              />
            </Item.Value>
          </Item>
          <Item
            useHaptics={false}
            animate={false}
            onPress={updateShowExactAddress}
            isLastItem
          >
            <Item.Label>Show exact address</Item.Label>
            <Item.Value hasTrailingIcon={false}>
              <Switch
                selected={show_exact_address}
                onPress={updateShowExactAddress}
              />
            </Item.Value>
          </Item>
        </Card>
        <Small style={{ paddingHorizontal: Spacings.md }} secondary>
          These settings will be applied as default when you create new
          listings.
        </Small>
      </View>
    </ScrollView>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({
  defaultsContainer: {
    gap: Spacings.sm,
  },
});
