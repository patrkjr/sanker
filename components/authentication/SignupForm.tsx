import React, { useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { View, ViewProps } from '../Themed';
import { Link } from 'expo-router';
import * as z from 'zod';

import Spacings from '@/constants/Spacings';
import { P } from '../typography';
import Button from '../ui/Button';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '@/config/supabase';
import useUserStore from '@/stores/userStore';
import ControlledInputField from '../ui/ControlledInputField';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';

// ___ Template code for signing up new users ___

const PASSWORD_MAX = 80;
const PASSWORD_MIN = 7;

const formSchema = z.object({
  first_name: z
    .string()
    .regex(
      /^[\p{L}\- ]+$/u,
      'First name can only contain letters and hyphens.'
    ),
  last_name: z
    .string()
    .regex(/^[\p{L}\- ]+$/u, 'Last name can only contain letters and hyphens.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z
    .string()
    .min(
      PASSWORD_MIN,
      `Password must be at least ${PASSWORD_MIN} characters long.`
    )
    .max(80, `Password can be no more than ${PASSWORD_MAX} characters long.`),
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
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
    },
  });

  const [activeField, setActiveField] = useState<string | null>(null);

  const onSubmit = async (formData) => {
    const { email, password } = formData;
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
        const { error: userError } = await supabase.from('users').insert([
          {
            ...formData,
            id: user.id, // Use the id from the `auth` table
          },
        ]);

        if (userError) {
          throw new Error(userError.message);
        }

        // Set both normal table data
        setUser({ ...formData, id: user.id, items: [] });
      }
    } catch (error) {
      Alert.alert(error?.message);
      return null;
    }
  };

  //Refs
  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const keyboard = useAnimatedKeyboard();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
  }));

  const handleFocus = (pageY) => {
    // Kinda works but theres a bug with the top most field. TODO: fix it later
    scrollViewRef.current?.scrollTo({
      y: pageY - 200,
      animated: true,
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'android' ? 98 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentInsetAdjustmentBehavior="automatic"
        scrollToOverflowEnabled={false}
        contentContainerStyle={[
          {
            gap: Spacings.md,
            paddingHorizontal: Spacings.sm,
          },
          animatedStyles,
        ]}
      >
        {/* Name field */}
        <View style={{ gap: Spacings.sm }}>
          <ControlledInputField
            control={control}
            title="First name"
            name="first_name"
            setActiveField={setActiveField}
            isActive={activeField === 'first_name'}
            handleFocus={handleFocus}
            errorMessage={errors?.first_name && errors.first_name.message}
          />

          <ControlledInputField
            control={control}
            title="Last name"
            name="last_name"
            setActiveField={setActiveField}
            isActive={activeField === 'last_name'}
            handleFocus={handleFocus}
            errorMessage={errors?.last_name && errors.last_name.message}
          />

          {/* Email field */}
          <ControlledInputField
            control={control}
            title="Email"
            name="email"
            isActive={activeField === 'email'}
            setActiveField={setActiveField}
            handleFocus={handleFocus}
            editable={!isSubmitting}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
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
    </KeyboardAvoidingView>
  );
}
