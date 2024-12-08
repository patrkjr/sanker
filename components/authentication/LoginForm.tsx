import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { View } from '../Themed';
import * as z from 'zod';
import Input from '../ui/Input';
import Spacings from '@/constants/Spacings';
import { H2, P } from '../typography';
import Button from '../ui/Button';
import { useSupabase } from '@/context/supabase-provider';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { supabase } from '@/config/supabase';
import useUserStore from '@/stores/userStore';

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
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            placeholder="eg. jane@youremaildomain.com"
            onBlur={() => {
              setActiveField(null);
              onBlur();
            }}
            onFocus={() => setActiveField('email')}
            active={activeField === 'email'}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={onChange}
            value={value}
            editable={!isSubmitting}
            errorMessage={errors.email && errors.email.message}
          />
        )}
      />

      {/* Password field */}
      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            placeholder="eg. the name of your dead cat"
            onBlur={() => {
              setActiveField(null);
              onBlur();
            }}
            active={activeField === 'password'}
            onFocus={() => setActiveField('password')}
            autoComplete="password"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={onChange}
            value={value}
            editable={!isSubmitting}
            errorMessage={errors.password && errors.password.message}
          />
        )}
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
