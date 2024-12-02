import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { View } from '../Themed';
import { Link } from 'expo-router';
import * as z from 'zod';
import Input from '../ui/Input';

import Spacings from '@/constants/Spacings';
import { H1, H2, H3, H4, P } from '../typography';
import Button from '../ui/Button';
import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { supabase } from '@/config/supabase';
import useUserStore from '@/stores/userStore';

// ___ Template code for signing up new users ___

const formSchema = z.object({
  full_name: z
    .string()
    .regex(/^[\p{L}\- ]+$/u, 'Name can only contain letters and hyphens.'),
  email: z.string().email('Please enter a valid email adress.'),
  password: z
    .string()
    .min(7, 'Password must be at least 7 characters long.')
    .max(64, 'Password can be no more than 64 characters long.'),
  // .regex(
  //   /^(?=.*[a-z])/,
  //   'Your password must have at lease one uppercase letter.'
  // )
  // .regex(
  //   /^(?=.*[A-Z])/,
  //   'Your password must have at least one uppercase letter.'
  // )
  // .regex(
  //   /^(?=.*[!@#$%^&*])/,
  //   'Your password must have at least one special character.'
  // ),
});

export default function SignupForm() {
  const setUser = useUserStore((state) => state.setUser);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  const onSubmit = async (data) => {
    const { email, password, full_name } = data;
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const user = authData.user;

      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: user.id, // Use the id from the `auth` table
              full_name,
            },
          ]);

        if (userError) {
          throw new Error(userError.message);
        }

        setUser({ ...user, full_name, items: [] });
      }
    } catch (error) {
      Alert.alert(error?.message);
      return null;
    }
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: Spacings.md,
        paddingHorizontal: Spacings.sm,
      }}
    >
      {/* Name field */}
      <View style={{ gap: Spacings.sm }}>
        <Controller
          control={control}
          name="full_name"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Name"
              placeholder="eg. Jane Smith"
              onBlur={() => {
                setActiveField(null);
                onBlur();
              }}
              onFocus={() => setActiveField('name')}
              active={activeField === 'name'}
              autoCapitalize="words"
              autoComplete="name"
              onChangeText={onChange}
              value={value}
              editable={!isSubmitting}
              errorMessage={errors.name && errors.name.message}
            />
          )}
        />

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
              placeholder="Please type a uniq password"
              onBlur={() => {
                setActiveField(null);
                onBlur();
              }}
              onFocus={() => setActiveField('password')}
              active={activeField === 'password'}
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
          title="Submit"
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </View>

      <View style={{ alignItems: 'center', gap: Spacings.sm }}>
        <P secondary>Already got an account?</P>
        <Link href="/login" asChild>
          <Button ghost title="Log in" />
        </Link>
      </View>
    </ScrollView>
  );
}
