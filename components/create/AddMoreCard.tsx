import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import { Small } from '../typography';
import Animated, {
  FadeInRight,
  LinearTransition,
} from 'react-native-reanimated';
import Icon from '../ui/Icon';

interface Props {
  size?: number;
  onAddMore: () => void;
}

export default function AddMoreCard({ onAddMore, size = 100 }: Props) {
  return (
    <Animated.View layout={LinearTransition} style={{ flex: 1 }}>
      <Pressable onPress={onAddMore}>
        <Card style={[styles.addImage, { width: size }]}>
          <Icon name="ImagePlus" />
        </Card>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  addImage: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
