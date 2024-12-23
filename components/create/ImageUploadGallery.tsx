import React from 'react';
import Spacings from '@/constants/Spacings';
import AddImage from './ImagePicker';
import * as ImagePicker from 'expo-image-picker';
import Animated, { LinearTransition } from 'react-native-reanimated';
import ImageItem from './ImageItem';
import AddMoreCard from './AddMoreCard';
import * as Haptics from 'expo-haptics';

interface ImageUploadGalleryProps {
  images: [ImageAsset];
  onChangeImages: (images: ImageAsset[]) => void;
}

interface ImageAsset {
  uri: string;
}

export default function ImageUploadGallery({
  images,
  onChangeImages,
}: ImageUploadGalleryProps) {
  const pickImageAsync = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        selectionLimit: 5,
        orderedSelection: true,
        quality: 0,
        exif: false,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        //User cancelled the image picker.
        return;
      }

      let imageArray: ImageAsset[] = [];
      result.assets.forEach((image) => {
        imageArray.push({ uri: image.uri });
      });

      onChangeImages(imageArray);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert(error.message);
      }
    }
  };

  const removeImage = (index: number) => {
    const result = images.filter((_, i) => i !== index);
    onChangeImages(result);
  };

  if (images?.length == 0) {
    return <AddImage onPress={pickImageAsync} />;
  }

  return (
    <Animated.FlatList
      nestedScrollEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      data={images}
      itemLayoutAnimation={LinearTransition}
      style={{ overflow: 'visible' }}
      contentContainerStyle={{
        gap: Spacings.md,
        alignItems: 'center',
      }}
      keyExtractor={(item) => item.uri}
      renderItem={({ item, index }) => (
        <ImageItem
          item={item}
          shouldAnimate={images.length > 1}
          index={index}
          onRemoveImage={removeImage}
        />
      )}
      ListFooterComponent={
        images.length ? <AddMoreCard onAddMore={pickImageAsync} /> : null
      }
    />
  );
}
