import React from 'react';
import { View } from '../Themed';
import { Label, P, Small } from '../typography';
import Input from '../ui/Input';
import Spacings from '@/constants/Spacings';
import Button from '../ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import SelectableTag from '../ui/SelectableTag';
import Switch from '../ui/Switch';
import Item from '../ui/Item';
import Card from '../ui/Card';
import { supabase } from '@/config/supabase';
import useUserStore from '@/stores/userStore';
import { useRouter } from 'expo-router';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import ImageUploadGallery from './ImageUploadGallery';
import * as ImageManipulator from 'expo-image-manipulator';
import Animated, {
  LinearTransition,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';

const formSchema = z.object({
  price: z
    .string({
      required_error: 'Price is required.',
      invalid_type_error: 'Price must be a whole number.',
    })
    .regex(/^\d+$/, 'Must be a number'),
  title: z
    .string()
    .min(2, 'Give your item a title that is at lease 3 characters long.'),
  condition: z.enum(['new', 'used', 'worn'], {
    errorMap: (issue, ctx) => ({ message: 'Please describe the condition.' }),
  }),
  description: z.string(),
  use_user_address: z.boolean(),
  show_exact_address: z.boolean(),
  image_urls: z
    .array(
      z.object({
        uri: z.string().url(),
      })
    )
    .min(1, 'You need at least 1 image'),
});

export default function CreateForm() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_urls: [],
      price: '',
      title: '',
      condition: '',
      description: '',
      use_user_address: true,
      show_exact_address: true,
    },
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  const onSubmit = async (data) => {
    try {
      // Generate a uuid
      setIsLoading(true);
      const id = uuidv4();

      // Upload the images
      const imageUrls = await uploadImages(id, data.image_urls);

      //Insert the new item into database
      const { error } = await supabase
        .from('items')
        .insert({ id, ...data, image_urls: imageUrls, owner_id: user?.id });
      if (error) {
        Alert.alert(error?.message);
        return;
      }
      router.push({
        pathname: '/new/success',
        params: {
          ...data,
          image_urls: JSON.stringify(imageUrls),
        },
      });
      reset();
    } catch (error) {
      Alert.alert(error?.message);
    } finally {
      setIsLoading(false);
    }
  };

  //Refs
  const scrollViewRef = useRef<ScrollView>(null);
  const titleRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);

  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  const handleFocus = (ref, fieldName: string) => {
    if (ref?.current && scrollViewRef?.current) {
      ref.current.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ x: 0, y: y - 128, animated: true });
        },
        (error) => {
          console.error('measureLayout error:', error);
        }
      );
    }
    setActiveField(fieldName);
  };

  function handleResetForm() {
    Alert.alert('Reset form?', 'Your changes will not be saved.', [
      {
        text: 'Keep editing',
        style: 'cancel',
        isPreferred: true,
      },
      {
        text: 'Reset form',
        style: 'destructive',
        onPress: () => (reset(), scrollViewRef?.current?.scrollTo({ y: 0 })),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 98 : 0}
    >
      <Animated.ScrollView
        ref={scrollViewRef}
        layout={LinearTransition}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[
          {
            paddingHorizontal: Spacings.md,
            paddingVertical: Spacings.md,
            gap: Spacings.lg,
          },
          animatedStyles,
        ]}
      >
        {/* Image upload */}
        <Controller
          control={control}
          name="image_urls"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <View
              style={{
                gap: Spacings.sm,
                overflow: 'visible',
              }}
            >
              <ImageUploadGallery images={value} onChangeImages={onChange} />
              {errors?.image_urls && (
                <Small style={{ paddingHorizontal: Spacings.sm }} error>
                  {errors.image_urls.message}
                </Small>
              )}
            </View>
          )}
        />

        {/* Title field */}
        <Controller
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              ref={titleRef}
              label="Title"
              value={value}
              onChangeText={onChange}
              onBlur={() => {
                setActiveField(null);
                onBlur();
              }}
              onFocus={() => handleFocus(titleRef, 'title')}
              active={activeField === 'title'}
              errorMessage={errors.title?.message}
            />
          )}
        />

        {/* Price field */}
        <Controller
          control={control}
          name="price"
          rules={{ required: true }}
          render={({ field: { onBlur, onChange, value } }) => (
            <Input
              ref={priceRef}
              label="Price"
              value={value}
              inputMode="numeric"
              onChangeText={onChange}
              onBlur={() => {
                setActiveField(null);
                onBlur();
              }}
              onFocus={() => handleFocus(priceRef, 'price')}
              active={activeField === 'price'}
              errorMessage={errors.price?.message}
            />
          )}
        />

        {/* Condition field */}
        <Controller
          control={control}
          name="condition"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View style={{ gap: Spacings.sm }}>
              <Label style={{ paddingHorizontal: Spacings.sm }}>
                Condition
              </Label>
              <View style={styles.conditionOptions}>
                <SelectableTag
                  selected={value === 'new'}
                  onPress={() => onChange('new')}
                  text="Like new"
                />
                <SelectableTag
                  selected={value === 'used'}
                  onPress={() => onChange('used')}
                  text="Nice but used"
                />
                <SelectableTag
                  selected={value === 'worn'}
                  onPress={() => onChange('worn')}
                  text="Worn"
                />
              </View>
              {errors?.condition && (
                <Small style={{ paddingHorizontal: Spacings.sm }} error>
                  {errors.condition.message}
                </Small>
              )}
            </View>
          )}
        />

        {/* Description field */}
        <Controller
          control={control}
          name="description"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Input
                ref={descriptionRef}
                label="Description"
                value={value}
                style={{ minHeight: 120, maxHeight: 140 }}
                multiline
                onChangeText={onChange}
                onBlur={() => {
                  setActiveField(null);
                  onBlur();
                }}
                onFocus={() => handleFocus(descriptionRef, 'description')}
                active={activeField === 'description'}
                helperMessage="Description is optional"
                errorMessage={errors.description?.message}
              />
            </>
          )}
        ></Controller>

        {/* Address fields */}
        <Card>
          <Controller
            control={control}
            name="use_user_address"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Item animate={false} onPress={() => onChange(!value)}>
                <Item.Label>Use my address as location</Item.Label>
                <Item.Value hasTrailingIcon={false}>
                  <Switch selected={value} onPress={() => onChange(!value)} />
                </Item.Value>
              </Item>
            )}
          ></Controller>

          <Controller
            control={control}
            name="show_exact_address"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Item animate={false} onPress={() => onChange(!value)} isLastItem>
                <Item.Label>Show address</Item.Label>
                <Item.Value hasTrailingIcon={false}>
                  <Switch selected={value} onPress={() => onChange(!value)} />
                </Item.Value>
              </Item>
            )}
          ></Controller>
        </Card>

        {/* Submit button */}
        <Button
          title="Post item"
          disabled={isLoading || isSubmitting}
          themed
          onPress={handleSubmit(onSubmit)}
        />
        {isDirty && (
          <Button ghost title="Reset form" onPress={handleResetForm} />
        )}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  conditionOptions: {
    flexDirection: 'row',
    gap: Spacings.xs,
    flexWrap: 'wrap',
  },
});

const compressImage = async (uri: string) => {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1000 } }], // Resize width, maintain aspect ratio
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to 70%
    );
    return manipulatedImage;
  } catch (error) {
    console.error('compressImage function: ' + error.message);
    alert(error?.message);
  }
};

const uploadImages = async (itemId: string, images: [{ uri: string }]) => {
  const uploadedUrls = [];
  for (const image of images) {
    const compressedImage = await compressImage(image.uri);
    const fileName = `items/${itemId}/${Date.now()}.jpeg`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, compressedImage, {
        contentType: image.mimeType ?? 'image/jpeg',
      });

    if (data) {
      try {
        const {
          data: { publicUrl },
        } = await supabase.storage.from('images').getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error getting absolute URL: ' + error?.message);
      }
    } else {
      console.error('Image upload failed: ', error);
    }
  }
  return uploadedUrls;
};
