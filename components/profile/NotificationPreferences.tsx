import React from 'react';
import Item from '../ui/Item';
import { ScrollView } from 'react-native-gesture-handler';
import Card from '../ui/Card';
import Spacings from '@/constants/Spacings';
import Switch from '../ui/Switch';
import usePreferencesStore from '@/stores/preferenceStore';
import { P, Small } from '../typography';
import Animated, { FadeOutUp, LinearTransition } from 'react-native-reanimated';
import DefaultStyles from '@/constants/DefaultStyles';

export default function NotificationPreferences() {
  const { userPreferences, setPreferences } = usePreferencesStore();

  function handleUpdateNotificationPreferences() {
    setPreferences({
      notificationsEnabled: !userPreferences.notificationsEnabled,
    });
  }

  return (
    <ScrollView contentContainerStyle={pageContainer}>
      <Card layout={LinearTransition}>
        <Item
          useHaptics={false}
          animate={false}
          isLastItem
          onPress={handleUpdateNotificationPreferences}
        >
          <Item.Label>Get notifications</Item.Label>
          <Item.Value hasTrailingIcon={false}>
            <Switch
              onPress={handleUpdateNotificationPreferences}
              selected={userPreferences.notificationsEnabled}
            />
          </Item.Value>
        </Item>
        {userPreferences.notificationsEnabled && (
          <Animated.View exiting={FadeOutUp}>
            <P secondary>
              Right on brother, but unfortunately, we haven't made this feature
              yet. We're working on it though ✌️
            </P>
          </Animated.View>
        )}
      </Card>
    </ScrollView>
  );
}

const { pageContainer } = DefaultStyles;

// const styles = StyleSheet.create({
//   ...DefaultStyles.pageContainer,
// });
