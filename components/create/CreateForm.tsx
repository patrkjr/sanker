import { CATEGORY_NAME } from '@/constants/CategoryNames';
import Spacings from '@/constants/Spacings';
import useCreateItem from '@/hooks/useCreateItem';
import { useDefaultFormValues } from '@/hooks/useDefaultFormValues';
import useItemFormStore from '@/stores/itemFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  type ScrollView,
  StyleSheet,
} from 'react-native';
import 'react-native-get-random-values';
import {
  LinearTransition,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
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
import { createFormSchema } from './createFormSchema';

export default function CreateForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setForm, resetForm, isDraft, formData, setIsDraft } =
    useItemFormStore();
  const selectedCategorySlug = useItemFormStore(
    (state) => state.formData.category_slug
  );

  const defaultValues = useDefaultFormValues();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(createFormSchema),
    defaultValues,
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  //const { showWidget, setError, hideWidget } = useProgressWidgetStore();
  const { createItem } = useCreateItem();

  const currentFormData = watch();

  useEffect(() => {
    setValue('category_slug', selectedCategorySlug, { shouldDirty: true });
  }, [selectedCategorySlug]);

  useEffect(() => {
    if (isDraft) {
      reset(formData);
    }
  }, [formData, reset, isDraft]);

  useEffect(() => {
    if (isDirty) {
      setForm(currentFormData);
      setIsDraft(true);
    }
  }, [currentFormData, isDirty, setForm, setIsDraft]);

  // function testSubmit() {
  //   router.dismiss();
  //   simulateProgressUpdate();
  // }

  const onSubmit = async (data) => {
    //router.push('/create/uploading-item');
    //setForm(data);
    createItem(data);
    reset(defaultValues);
    router.dismiss();
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
    Alert.alert('Start over?', 'Your changes will not be saved.', [
      {
        text: 'Keep editing',
        style: 'cancel',
        isPreferred: true,
      },
      {
        text: 'Reset form',
        style: 'destructive',
        onPress: () => {
          resetForm();
          reset(defaultValues);
          //Disable scroll for now:
          //scrollViewRef?.current?.scrollTo({ y: 0 });
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 98 : 0}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <Button
              title="Start over"
              variant="ghost"
              disabled={isDirty || !isDraft}
              onPress={handleResetForm}
            />
          ),
        }}
      />
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
          />

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
          />
        </Card>

        {/* Category field */}
        <View style={{ gap: Spacings.sm }}>
          <Controller
            control={control}
            name="category_slug"
            render={({ field: { value } }) => (
              <Card>
                <Item
                  href={'./pick-category'}
                  relativeToDirectory={true}
                  isLastItem
                >
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
          variant="themed"
          onPress={handleSubmit(onSubmit)}
          //onPress={testSubmit}
        />
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
