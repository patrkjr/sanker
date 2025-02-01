import { View } from '@/components/Themed';
import { P } from '@/components/typography';
import Card from '@/components/ui/Card';
import Item from '@/components/ui/Item';
import Switch from '@/components/ui/Switch';
import Spacings from '@/constants/Spacings';
import usePreferencesStore from '@/stores/preferenceStore';
import React from 'react';

export default function NotificationPreferences() {
  const { userPreferences, setPreferences } = usePreferencesStore();

  function handleUpdateNotificationPreferences() {
    setPreferences({
      notificationsEnabled: !userPreferences.notificationsEnabled,
    });
  }

  return (
    <View style={{ gap: Spacings.sm }}>
      <Card>
        <Item
          useHaptics={false}
          animate={false}
          isLastItem
          onPress={handleUpdateNotificationPreferences}
        >
          <Item.Label>Push notifications</Item.Label>
          <Item.Value hasTrailingIcon={false}>
            <Switch
              onPress={handleUpdateNotificationPreferences}
              selected={userPreferences.notificationsEnabled}
            />
          </Item.Value>
        </Item>
        <View style={{ backgroundColor: 'transparent' }}>
          <P secondary>
            Get a notication when someone is interested in your listing, or when
            you have a new message.
          </P>
        </View>
      </Card>
    </View>
  );
}
