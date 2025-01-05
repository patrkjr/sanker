import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import Input from '../ui/Input';
import Spacings from '@/constants/Spacings';
import Button from '../ui/Button';
import { useSupabase } from '@/context/supabase-provider';
import { useState } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/config/supabase';
import useUserStore from '@/stores/userStore';
import ControlledInputField from '../ui/ControlledInputField';
import { ScrollView } from 'react-native-gesture-handler';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email adress.'),
  password: z.string(),
});

export default function LoginForm() {
  const { signInWithPassword } = useSupabase();
  const setUser = useUserStore((state) => state.setUser);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  const onSubmit = async ({ email, password }) => {
    try {
      // Try to log in the user
      await signInWithPassword(email, password);

      //If sign in is successfull, we get data for the global userStore

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error, status } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      setUser({ ...data, ...user });
    } catch (error) {
      console.log(error);
      Alert.alert(error?.message);
    }
  };

  function handleFocus(inputRef) {
    // Scroll here
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        gap: Spacings.sm,
        paddingHorizontal: Spacings.sm,
      }}
    >
      {/* Email field */}
      <ControlledInputField
        control={control}
        name="email"
        isActive={activeField === 'email'}
        setActiveField={setActiveField}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        editable={!isSubmitting}
        errorMessage={errors.email && errors.email.message}
      />

      {/* Password field */}
      <ControlledInputField
        control={control}
        name="password"
        isActive={activeField === 'password'}
        setActiveField={setActiveField}
        handleFocus={handleFocus}
        autoComplete="password"
        autoCapitalize="none"
        secureTextEntry={true}
        editable={!isSubmitting}
        errorMessage={errors.password && errors.password.message}
      />

      <Button
        title="Log in"
        themed
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
      <Button title="Forgot password" ghost />
    </ScrollView>
  );
}
