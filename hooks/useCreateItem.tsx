import { supabase } from '@/config/supabase';
import { useSupabase } from '@/context/supabase-provider';
import useItemFormStore from '@/stores/itemFormStore';
import useItemStore from '@/stores/itemStore';
import { useProgressWidgetStore } from '@/stores/progressWidgetStore';
import { compressImage } from '@/utils/compressImage';
import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useCreateItem = () => {
  const { user } = useSupabase();
  const { setItem } = useItemStore();
  const [uploadStatus, setUploadStatus] = useState({
    isUploading: false,
    message: 'Starting creation...',
    progress: 0,
    error: null,
  });

  const [id, setId] = useState<null | string>(null);
  const { showWidget, setError } = useProgressWidgetStore();
  const { resetForm } = useItemFormStore();
  // const compressImage = useCallback(async (uri: string) => {
  //   try {
  //     const manipulatedImage = await ImageManipulator.manipulateAsync(
  //       uri,
  //       [{ resize: { width: 1000 } }],
  //       { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  //     );
  //     return manipulatedImage;
  //   } catch (error) {
  //     console.error('compressImage function: ' + error.message);
  //     setUploadStatus((prev) => ({ ...prev, error: error.message }));
  //     throw error;
  //   }
  // }, []);

  const uploadImages = useCallback(
    async (itemId: string, images: [{ uri: string }]) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const uploadedUrls = [];
      showWidget('Starting image upload...', {
        isDismissible: false,
        progress: 10,
      });
      // setUploadStatus((prev) => ({
      //   ...prev,
      //   isUploading: true,
      //   message: 'Starting image upload...',
      //   progress: 10,
      //   error: null,
      // }));
      for (let i = 0; i < images.length; i++) {
        try {
          const image = images[i];
          const compressedImage = await compressImage(image.uri);
          const fileName = `items/${itemId}/${Date.now()}.jpeg`;
          const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, compressedImage, {
              contentType: 'image/jpeg',
            });

          if (data) {
            const {
              data: { publicUrl },
            } = await supabase.storage.from('images').getPublicUrl(data.path);
            uploadedUrls.push(publicUrl);
          } else {
            console.error('Image upload failed: ', error);
            setError('Image upload failed');
            setUploadStatus((prev) => ({ ...prev, error: error.message }));
            throw error;
          }

          // Update progress
          showWidget('Uploading images...', {
            isDismissible: false,
            progress: ((i + 1) / images.length) * 80,
          });
          // setUploadStatus((prev) => ({
          //   ...prev,
          //   message: `Uploading images...`,
          //   progress: ((i + 1) / images.length) * 80,
          // }));
        } catch (error) {
          console.warn('Error during image upload: ', error);
          setError('Image upload failed');
          // setUploadStatus((prev) => ({ ...prev, error: error.message }));
          break;
        }
      }
      return uploadedUrls;
    },
    [compressImage]
  );

  const createItem = useCallback(
    async (data) => {
      showWidget('Starting creation...', { isDismissible: false, progress: 5 });
      // setUploadStatus((prev) => ({
      //   ...prev,
      //   isUploading: true,
      //   message: 'Starting creation...',
      //   progress: 5,
      //   error: null,
      // }));
      //   // Upload the images
      try {
        //   // Generate a uuid
        // const fakeError = new Error('Something went wrong..');
        // throw fakeError;
        const itemId = uuidv4();
        setId(itemId);
        const imageUrls = await uploadImages(itemId, data?.image_urls);

        //Insert the new item into database
        showWidget('Saving item...', { isDismissible: false, progress: 90 });
        // setUploadStatus((prev) => ({
        //   ...prev,
        //   progress: 90,
        //   message: 'Saving item...',
        // }));

        const newItem = {
          ...data,
          id: itemId,
          image_urls: imageUrls,
          owner_id: user?.id,
        };

        const { error: itemError } = await supabase
          .from('items')
          .insert(newItem);

        if (itemError) {
          throw itemError;
        }

        setItem(newItem);

        showWidget('Done', { isDismissible: true, progress: 100 });
        resetForm();
        // setUploadStatus((prev) => ({
        //   ...prev,
        //   isUploading: false,
        //   message: 'Done',
        //   progress: 100,
        //   error: null,
        // }));

        // This is used to delay the succesfull navigation
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        console.error('Error saving the item: ', error.message);
        setError('Error saving the item');
        // setUploadStatus((prev) => ({ ...prev, error: error.message }));
      }
    },
    [uploadImages]
  );

  return { createItem, uploadStatus, id };
};

export default useCreateItem;
