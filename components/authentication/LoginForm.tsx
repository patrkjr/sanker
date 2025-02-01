import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { useSupabase } from '@/context/supabase-provider';
import useUserProfileStore from '@/stores/useUserProfileStore';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as z from 'zod';
import Button from '../ui/Button';
import ControlledInputField from '../ui/ControlledInputField';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email adress.'),
  password: z.string(),
});

export default function LoginForm() {
  const { signInWithPassword } = useSupabase();
  const setUserProfile = useUserProfileStore((state) => state.setUserProfile);

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

      setUserProfile({ ...data });
    } catch (error) {
      console.warn(error);
      Alert.alert(error?.message);
    }
  };

  function handleFocus(pageY) {
    //console.log(pageY);
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
        title="Email"
        isActive={activeField === 'email'}
        setActiveField={setActiveField}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        handleFocus={handleFocus}
        editable={!isSubmitting}
        errorMessage={errors.email && errors.email.message}
      />

      {/* Password field */}
      <ControlledInputField
        control={control}
        name="password"
        title="Password"
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
        variant="themed"
        disabled={isSubmitting}
        onPress={handleSubmit(onSubmit)}
      />
      <Button title="Forgot password" ghost />
    </ScrollView>
  );
}
