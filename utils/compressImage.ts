import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (
  uri: string,
  onError: (error: string) => void
) => {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulatedImage;
  } catch (error: any) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('compressImage function: ' + errorMessage);
    onError(errorMessage);
    throw new Error(errorMessage);
  }
};
