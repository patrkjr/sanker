import { View } from '@/components/Themed';
import { Label, Small } from '@/components/typography';
import Card from '@/components/ui/Card';
import Item from '@/components/ui/Item';
import Switch from '@/components/ui/Switch';
import DefaultStyles from '@/constants/DefaultStyles';
import Spacings from '@/constants/Spacings';
import usePreferencesStore from '@/stores/preferenceStore';
import React from 'react';
import { StyleSheet } from 'react-native';

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
    <View style={styles.defaultsContainer}>
      <Label>Defaults</Label>
      <Card>
        <Item useHaptics={false} animate={false} onPress={updateUseUserAddress}>
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
        These settings will be applied as default when you create new listings.
      </Small>
    </View>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({
  defaultsContainer: {
    gap: Spacings.sm,
  },
});
