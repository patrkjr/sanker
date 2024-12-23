import Animated, { FadeOutLeft } from 'react-native-reanimated';
import React from 'react';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Pressable, StyleSheet } from 'react-native';
import Spacings from '@/constants/Spacings';
import { View } from '../Themed';
import { Image } from 'expo-image';
import Icon from '../ui/Icon';

const IMAGE_SIZE = 100;

export default function ImageItem({
  item,
  index,
  shouldAnimate = true,
  onRemoveImage,
}: {
  item: { uri: string };
  index: number;
  shouldAnimate: boolean;
  onRemoveImage: (index: number) => void;
}) {
  const colors = useThemedColors();

  // Note that shouldAnimate does not work at this time
  // Animation will still happen on the last item
  return (
    <Animated.View
      exiting={shouldAnimate ? FadeOutLeft : undefined}
      style={{
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        backgroundColor: colors.cardDisabled,
        borderRadius: Spacings.borderRadius.md,
        overflow: 'hidden',
      }}
    >
      <Pressable
        style={{
          position: 'absolute',
          zIndex: 1,
          right: Spacings.sm,
          top: Spacings.sm,
        }}
        onPress={() => onRemoveImage(index)}
      >
        <View
          style={{
            backgroundColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon name="Trash2" color={'#ffffff'} />
        </View>
      </Pressable>
      <Image style={styles.image} source={item.uri} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
});
