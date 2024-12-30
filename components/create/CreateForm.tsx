import React, { useEffect } from 'react';
import { View } from '../Themed';
import { H3, Label, Large, P, Small } from '../typography';
import Input from '../ui/Input';
import Spacings from '@/constants/Spacings';
import Button from '../ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, set } from 'react-hook-form';
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
import useUserStore from '@/stores/userStore';
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import 'react-native-get-random-values';
import ImageUploadGallery from './ImageUploadGallery';
import Animated, {
  LinearTransition,
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import ControlledInputField from '../ui/ControlledInputField';
import useItemFormStore from '@/stores/itemFormStore';
import usePreferencesStore from '@/stores/preferenceStore';

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
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { setForm } = useItemFormStore();
  const { userPreferences } = usePreferencesStore();

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
      use_user_address: userPreferences.location.use_user_address,
      show_exact_address: userPreferences.location.show_exact_address,
    },
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  const onSubmit = async (data) => {
    //router.push('/create/uploading-item');
    setForm(data);
    router.push('/create/uploading-item');
    reset();
    scrollViewRef?.current?.scrollTo({ y: 0 });
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
        <ControlledInputField
          name="title"
          title="Title"
          control={control}
          ref={titleRef}
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
          ref={priceRef}
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

        <Card>
          <Item href={'/create/pick-category'} isLastItem>
            <Item.Label>Pick category</Item.Label>
            <Item.Value>Gear</Item.Value>
          </Item>
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
  fullPageFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'red',
  },
});
