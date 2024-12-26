import React from 'react';
import { StyleSheet } from 'react-native';
import { P } from '../typography';
import Card from '../ui/Card';
import Icon from '../ui/Icon';
import Spacings from '@/constants/Spacings';

export default function AddImage({ onPress }: { onPress: () => void }) {
  //onPress(() => pickImageAsync());

  return (
    <Card style={[styles.card]} onPress={onPress}>
      <Icon name="ImagePlus" />
      <P secondary style={{ textAlign: 'center' }}>
        Add image
      </P>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 200,
    gap: Spacings.xxs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
