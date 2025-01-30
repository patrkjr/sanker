import Spacings from '@/constants/Spacings';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import Animated from 'react-native-reanimated';
import AddMoreCard from './AddMoreCard';
import ImageItem from './ImageItem';
import AddImage from './ImagePicker';

interface ImageUploadGalleryProps {
  images: [ImageAsset];
  onChangeImages: (images: ImageAsset[]) => void;
}

interface ImageAsset {
  uri: string;
}

const IMAGE_SIZE = 100;
const GAP = Spacings.md;

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

  const THRESHOLD_FACTOR = 0.6;
  const SLOT_SIZE = IMAGE_SIZE + GAP;

  const [offsetIndexes, setOffsetIndexes] = useState<number[]>([]);
  const [offsetX, setOffsetX] = useState(0);

  const handleDrag = (
    index: number,
    translationX: number,
    finalize: boolean
  ) => {
    const dragThreshold = SLOT_SIZE * THRESHOLD_FACTOR;
    const direction = Math.sign(translationX);
    const offsetDistance = Math.abs(translationX);

    const newIndex =
      index + direction * Math.floor((offsetDistance / dragThreshold) * 0.8);

    setOffsetX(direction * SLOT_SIZE * -1);
    const numberOfIndexes =
      direction * Math.floor((offsetDistance / dragThreshold) * 0.8) +
      direction;
    if (numberOfIndexes === 0) {
      setOffsetX(0);
      setOffsetIndexes([]);
    } else if (direction === -1) {
      let indexesToAdd = [];
      for (let i = -1; i > numberOfIndexes; i--) {
        indexesToAdd.push(index + i);
      }
      setOffsetIndexes(indexesToAdd);
    } else {
      let indexesToAdd = [];
      for (let i = 1; i < numberOfIndexes; i++) {
        indexesToAdd.push(index + i);
      }
      setOffsetIndexes(indexesToAdd);
    }

    if (
      finalize &&
      newIndex !== index &&
      newIndex >= 0 &&
      newIndex < images.length
    ) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setOffsetIndexes([]);
      setOffsetX(0);
      const newImages = [...images];
      const [movedItem] = newImages.splice(index, 1);
      newImages.splice(newIndex, 0, movedItem);
      onChangeImages(newImages);
    }
  };

  return (
    <Animated.FlatList
      nestedScrollEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      // LinearTransition is making a ugly animation when dragging to reorder. Fix in the future.
      data={images}
      style={{ overflow: 'visible' }}
      contentContainerStyle={{
        gap: GAP,
        alignItems: 'center',
      }}
      keyExtractor={(item) => item.uri}
      renderItem={({ item, index }) => (
        <ImageItem
          item={item}
          onDrag={handleDrag}
          shouldAnimate={images.length > 1}
          offset={offsetIndexes.includes(index) ? offsetX : 0}
          index={index}
          onRemoveImage={removeImage}
        />
      )}
      ListFooterComponent={
        images.length ? (
          <AddMoreCard onAddMore={pickImageAsync} size={IMAGE_SIZE} />
        ) : null
      }
    />
  );
}
