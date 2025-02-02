import { useSupabase } from '@/context/supabase-provider';
import { useImageUpload } from '@/hooks/useImageUpload';
import * as Haptics from 'expo-haptics';
import React from 'react';
import Button from '../ui/Button';
import ProfilePicture from './ProfilePicture';

// This component can be updated to only take needed props
// Right now it takes a whole profile, but only uses names and image url

interface Profile {
  id: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  phone_verified?: boolean;
  // Add any other properties that are relevant to the profile
}

interface ProfilePictureProps {
  profile: Profile;
  size: number;
  editable: boolean;
  updateProfilePicture: () => void;
}

export default function EditAvatar({
  editable = false,
  size = 72,
}: ProfilePictureProps) {
  const { user } = useSupabase();
  const { handleUpdateProfilePicture, isLoading } = useImageUpload();

  return (
    <>
      <ProfilePicture
        userId={user?.id}
        size={size}
        pressable={false}
        isLoading={isLoading}
      />
      <Button
        size="sm"
        title="Edit profile picture"
        style={{ width: 'auto' }}
        disabled={!editable || isLoading}
        onPress={handleUpdateProfilePicture}
        onPressOut={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      />
    </>
  );
}
