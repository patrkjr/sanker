import React from 'react';
import { StyleSheet } from 'react-native';
import Card from '../ui/Card';
import Icon from '../ui/Icon';

interface Props {
  size?: number;
  onAddMore: () => void;
}

export default function AddMoreCard({ onAddMore, size = 100 }: Props) {
  return (
    <Card
      style={[styles.addImage, { width: size, height: size }]}
      onPress={onAddMore}
    >
      <Icon name="ImagePlus" />
    </Card>
  );
}

const styles = StyleSheet.create({
  addImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
