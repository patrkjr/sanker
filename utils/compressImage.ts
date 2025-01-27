//import * as ImageManipulator from 'expo-image-manipulator';
import {
  ImageManipulator,
  type ImageRef,
  type ImageResult,
  SaveFormat,
} from 'expo-image-manipulator';

export const compressImage = async (uri: string, width = 1000) => {
  try {
    const refImage = ImageManipulator.manipulate(uri);
    refImage.resize({ width });
    const manipulatedImage: ImageRef = await refImage.renderAsync();
    const compressedImage: ImageResult = await manipulatedImage.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
    });
    return compressedImage;
  } catch (error: any) {
    console.error(`compressImage function: ${error}`);
    throw new Error(error);
  }
};
