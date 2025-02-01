import DefaultStyles from '@/constants/DefaultStyles';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppInfo from '../AppInfo';
import Card from '../ui/Card';
import Item from '../ui/Item';

export default function AboutSanker() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={pageContainer}
    >
      <Card>
        <Item href={'/onboarding'} isLastItem>
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
