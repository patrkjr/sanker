import React, { useRef } from 'react';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { Basic as DotIndicators } from '../Pagination';
import { useSharedValue } from 'react-native-reanimated';
import Spacings from '@/constants/Spacings';
import { grey } from '@/constants/Colors';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { View } from '../Themed';

const IMAGE_HEIGHT = 300;

export default function ImageCarousel({ imageUrls }) {
  console.log(imageUrls);
  const colors = useThemedColors();
  const ref = useRef<ICarouselInstance>(null);
  const { width } = useWindowDimensions();

  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  const isEnabled = imageUrls.length >= 2;

  return (
    <View>
      <Carousel
        ref={ref}
        width={width - Spacings.md * 2}
        data={imageUrls}
        style={[styles.container, { backgroundColor: colors.card }]}
        enabled={isEnabled}
        onProgressChange={(offsetProgress, absoluteProgress) =>
          (progress.value = absoluteProgress)
        }
        renderItem={({ item, index }) => (
          <Image style={{ height: IMAGE_HEIGHT }} source={item} />
        )}
      />
      <DotIndicators
        progress={progress}
        data={imageUrls}
        onPress={onPressPagination}
        dotStyle={{
          backgroundColor: grey[500],
          borderRadius: Spacings.borderRadius.round,
        }}
        activeDotStyle={{
          backgroundColor: grey[50],
          borderRadius: Spacings.borderRadius.round,
        }}
        containerStyle={{
          gap: Spacings.xs,
          paddingHorizontal: Spacings.xs,
          paddingVertical: Spacings.xs,
          borderRadius: Spacings.borderRadius.round,
          backgroundColor: colors.darkScrim,
          position: 'absolute',
          bottom: Spacings.sm,
          display: !isEnabled && 'none',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: Spacings.borderRadius.lg,
    height: IMAGE_HEIGHT,
    overflow: 'hidden',
  },
});
