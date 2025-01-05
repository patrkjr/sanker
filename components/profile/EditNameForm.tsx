import { Alert, ScrollView, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Spacings from '@/constants/Spacings';
import Button from '../ui/Button';
import useUserStore from '@/stores/userStore';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/config/supabase';
import { useRouter } from 'expo-router';
import { P } from '../typography';
import { useSupabase } from '@/context/supabase-provider';

export default function EditNameForm() {
  const { user } = useSupabase();
  const profile = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  // ___ chatGPT regex ____
  // /^[\p{L}]+(?:[-' ][\p{L}]+)*$/u
  const formSchema = z.object({
    first_name: z
      .string()
      .regex(/^[\p{L}]+(?:[-' ][\p{L}]+)*$/u, 'Set a first name.'),
    last_name: z
      .string()
      .regex(/^[\p{L}]+(?:[-' ][\p{L}]+)*$/u, 'Set a last name.'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name,
      last_name: profile?.last_name,
    },
  });

  async function onSubmit(data) {
    try {
      const { first_name, last_name } = data;
      const { error: userError } = await supabase
        .from('users')
        .update({ first_name, last_name })
        .eq('id', user?.id);

      setUser({ ...profile, first_name, last_name });

      router.back();
    } catch (error) {
      Alert.alert(error.message);
    }
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.container}
    >
      <Controller
        control={control}
        rules={{ required: true }}
        name="first_name"
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <Input
              label="First name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              submitBehavior="blurAndSubmit"
              onSubmitEditing={onBlur}
            />
            {errors?.first_name && <P error>{errors.first_name.message}</P>}
          </>
        )}
      />
      <Controller
        control={control}
        rules={{ required: true }}
        name="last_name"
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <Input
              label="Last name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              submitBehavior="blurAndSubmit"
              onSubmitEditing={onBlur}
            />
            {errors?.last_name && <P error>{errors.last_name.message}</P>}
          </>
        )}
      />
      <Button title="Save" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacings.md,
    paddingHorizontal: Spacings.md,
  },
});
