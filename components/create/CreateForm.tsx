import Spacings from '@/constants/Spacings';
import useItemFormStore from '@/stores/itemFormStore';
import usePreferencesStore from '@/stores/preferenceStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import 'react-native-get-random-values';
import {
  LinearTransition,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as z from 'zod';
import { View } from '../Themed';
import { Label, Small } from '../typography';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ControlledInputField from '../ui/ControlledInputField';
import Item from '../ui/Item';
import PageScrollView from '../ui/PageScrollView';
import SelectableTag from '../ui/SelectableTag';
import Switch from '../ui/Switch';
import ImageUploadGallery from './ImageUploadGallery';

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

// This basically serves a temporary translation file.
const CATEGORY_NAME = {
  gear: 'Gear',
  clothing: 'Clothing',
  'food-and-cooking': 'Food & Cooking',
  'navigation-and-safety': 'Navigation & Safety',
  'kids-and-family': 'Kids & Family',
};

export default function CreateForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setForm, resetForm } = useItemFormStore();
  const selectedCategorySlug = useItemFormStore(
    (state) => state.data.category_slug
  );
  const { userPreferences } = usePreferencesStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_urls: [],
      price: '',
      title: '',
      condition: '',
      description: '',
      category_slug: null,
      use_user_address: userPreferences.location.use_user_address,
      show_exact_address: userPreferences.location.show_exact_address,
    },
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  useEffect(() => {
    setValue('category_slug', selectedCategorySlug, { shouldDirty: true });
  }, [selectedCategorySlug, setValue]);

  const onSubmit = async (data) => {
    //router.push('/create/uploading-item');
    setForm(data);
    router.push('/create/uploading-item');
    reset();
    scrollViewRef?.current?.scrollTo({ y: 0 });
  };

  //Refs
  const scrollViewRef = useRef<ScrollView>(null);

  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  const handleFocus = (inputRef) => {
    if (inputRef?.current && scrollViewRef?.current) {
      inputRef.current.measureLayout(
        scrollViewRef.current,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ x: 0, y: y - 156, animated: true });
        },
        (error) => {
          console.error('measureLayout error:', error);
        }
      );
    }
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
        onPress: () => (
          reset(), resetForm(), scrollViewRef?.current?.scrollTo({ y: 0 })
        ),
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 98 : 0}
    >
      <Stack.Screen options={{ presentation: 'modal' }} />
      <PageScrollView
        ref={scrollViewRef}
        layout={LinearTransition}
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
        <ControlledInputField
          name="title"
          title="Title"
          control={control}
          isActive={activeField === 'title'}
          setActiveField={setActiveField}
          handleFocus={handleFocus}
          errorMessage={errors?.title?.message}
        />

        {/* Price field */}
        <ControlledInputField
          name="price"
          title="Price"
          control={control}
          isActive={activeField === 'price'}
          setActiveField={setActiveField}
          handleFocus={handleFocus}
          errorMessage={errors?.price?.message}
          inputMode="numeric"
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
        <ControlledInputField
          control={control}
          title="Description"
          name="description"
          style={{ minHeight: 120, maxHeight: 140 }}
          setActiveField={setActiveField}
          isActive={activeField === 'description'}
          handleFocus={handleFocus}
          helperMessage="Description is optional"
          multiline
          errorMessage={errors.description?.message}
        />

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

        {/* Category field */}
        <View style={{ gap: Spacings.sm }}>
          <Controller
            control={control}
            name="category_slug"
            render={({ field: { value } }) => (
              <Card>
                <Item href={'/create/pick-category'} isLastItem>
                  <Item.Label>Category</Item.Label>
                  <Item.Value>
                    {value ? CATEGORY_NAME[value] : 'None'}
                  </Item.Value>
                </Item>
              </Card>
            )}
          />
          <Small style={{ paddingHorizontal: Spacings.md }} secondary>
            Categories are optional, but they help buyers find your item.
          </Small>
        </View>

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
      </PageScrollView>
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
