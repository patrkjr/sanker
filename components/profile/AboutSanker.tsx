import { StyleSheet } from 'react-native';
import React from 'react';
import { View } from '../Themed';
import { P } from '../typography';
import DefaultStyles from '@/constants/DefaultStyles';
import { ScrollView } from 'react-native-gesture-handler';
import Card from '../ui/Card';
import Item from '../ui/Item';
import usePreferencesStore from '@/stores/preferenceStore';
import Button from '../ui/Button';
import AppInfo from '../AppInfo';

export default function AboutSanker() {
  const { userPreferences } = usePreferencesStore();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={pageContainer}
    >
      <Card>
        <Item disabled isLastItem>
          <Item.Label>Onboarding</Item.Label>
          <Item.Value></Item.Value>
        </Item>
      </Card>
      <AppInfo />
    </ScrollView>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({});
