import { Image } from 'expo-image';
import { View, Text } from '../Themed';
import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Large, Small } from '../typography';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import Card from '../ui/Card';
import AddImage from './ImagePicker';
import * as ImagePicker from 'expo-image-picker';
import Icon from '../ui/Icon';

interface ImageUploadGalleryProps {
  images: [];
  onChangeImages: (images: ImageAsset[]) => void;
}

interface ImageAsset {
  uri: string;
}

const IMAGE_SIZE = 100;

export default function ImageUploadGallery({
  images,
  onChangeImages,
}: ImageUploadGalleryProps) {
  const colors = useThemedColors();

  const pickImageAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        orderedSelection: true,
        quality: 0,
        exif: false,
      });
      if (result.canceled || !result.assets || result.assets.length === 0) {
        //User cancelled the image picker.
        return;
      }

      const images = result.assets;

      onChangeImages(images);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        alert(error.message);
      }
    }
  };

  const removeImage = (index) => {
    const result = images.filter((_, i) => i !== index);
    onChangeImages(result);
  };

  const ScrollableGallery = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ overflow: 'visible' }}
        contentContainerStyle={{ gap: Spacings.md, alignItems: 'center' }}
      >
        {images.map((item, index) => {
          return (
            <View
              key={index}
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
                onPress={() => removeImage(index)}
              >
                <Icon name="Trash" color={'#ffffff'} />
              </Pressable>
              <Image style={styles.image} source={item.uri} />
            </View>
          );
        })}
        {images.length <= 4 && (
          <Pressable onPress={pickImageAsync}>
            <Card style={[styles.addImage]}>
              <Small>Add more</Small>
            </Card>
          </Pressable>
        )}
      </ScrollView>
    );
  };

  if (images.length <= 0) {
    return <AddImage onPress={pickImageAsync} />;
  }

  return <ScrollableGallery />;
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: '100%',
  },
  addImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
