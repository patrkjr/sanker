import { View } from '../Themed';
import { Label, P, Small } from '../typography';
import Input from '../ui/Input';
import Spacings from '@/constants/Spacings';
import Button from '../ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import SelectableTag from '../ui/SelectableTag';
import Switch from '../ui/Switch';
import Item from '../ui/Item';
import Card from '../ui/Card';
import { supabase } from '@/config/supabase';
import useUserStore from '@/stores/userStore';
import { useRouter } from 'expo-router';
import ImagePicker from './ImagePicker';

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
  condition: z.enum(['new', 'used', 'worn']),
  description: z.string(),
  use_user_address: z.boolean(),
  show_exact_address: z.boolean(),
  image_urls: z.array(z.string()).min(1, 'You need a least 1 image.'),
});

export default function CreateForm() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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
      const { error } = await supabase
        .from('items')
        .insert({ ...data, owner_id: user?.id });
      if (error) {
        Alert.alert(error?.message);
        return;
      }
      router.push({
        pathname: '/new/success',
        params: {
          ...data,
          image_urls: JSON.stringify(data.image_urls),
        },
      });
      reset();
    } catch (error) {
      Alert.alert(error?.message);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        gap: Spacings.lg,
        paddingHorizontal: Spacings.md,
        paddingVertical: Spacings.md,
      }}
    >
      {/* Image upload */}
      <Controller
        control={control}
        name="image_urls"
        rules={{ required: true }}
        render={({ field: { value } }) => (
          <View style={{ gap: Spacings.sm }}>
            <ImagePicker />
            {console.log('Images: ')}
            {console.log(value)}
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
            label="Title"
            value={value}
            onChangeText={onChange}
            onBlur={() => {
              setActiveField(null);
              onBlur();
            }}
            onFocus={() => setActiveField('title')}
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
            label="Price"
            value={value}
            inputMode="numeric"
            onChangeText={onChange}
            onBlur={() => {
              setActiveField(null);
              onBlur();
            }}
            onFocus={() => setActiveField('price')}
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
            <Label style={{ paddingHorizontal: Spacings.sm }}>Condition</Label>
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
              label="Description"
              value={value}
              style={{ minHeight: 120, maxHeight: 140 }}
              multiline
              onChangeText={onChange}
              onBlur={() => {
                setActiveField(null);
                onBlur();
              }}
              onFocus={() => setActiveField('description')}
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
        disabled={isSubmitting}
        themed
        onPress={handleSubmit(onSubmit)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conditionOptions: {
    flexDirection: 'row',
    gap: Spacings.xs,
    flexWrap: 'wrap',
  },
});
