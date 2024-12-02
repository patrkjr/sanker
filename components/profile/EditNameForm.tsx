import { Alert, ScrollView, StyleSheet } from "react-native";
import Input from "../ui/Input";
import Spacings from "@/constants/Spacings";
import Button from "../ui/Button";
import useUserStore from "@/stores/userStore";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/config/supabase";
import { useRouter } from "expo-router";
import { P } from "../typography";

export default function EditNameForm({ fullName = "...!" }) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  // ___ chatGPT regex ____
  // /^[\p{L}]+(?:[-' ][\p{L}]+)*$/u
  const formSchema = z.object({
    full_name: z
      .string()
      .regex(/^[\p{L}]+(?:[-' ][\p{L}]+)*$/u, "Set a name for yourself."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name,
    },
  });

  async function onSubmit(data) {
    try {
      const { full_name } = data;
      const { error: userError } = await supabase
        .from("users")
        .update({ full_name })
        .eq("id", user.id);

      setUser({ ...user, full_name });

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
        name="full_name"
        render={({ field: { onBlur, onChange, value } }) => (
          <>
            <Input
              autoFocus
              label="Full name"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              submitBehavior="blurAndSubmit"
              onSubmitEditing={onBlur}
            />
            {errors?.full_name && <P error>{errors.full_name.message}</P>}
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
