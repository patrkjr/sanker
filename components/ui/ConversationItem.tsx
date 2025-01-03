import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View } from '../Themed';
import { H4, P } from '../typography';
import { supabase } from '@/config/supabase';
import LoadingShimmer from './LoadingShimmer';
import ProfilePicture from '../profile/ProfilePicture';
import Spacings from '@/constants/Spacings';
import SelectableTag from './SelectableTag';
import { Link } from 'expo-router';

export default function ConversationItem({
  userId,
  message = '',
  href,
  tagMessage,
}: {
  userId: string;
  href: string;
  message: string;
  tagMessage: string;
}) {
  const [user, setUser] = useState<{} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUserDetailsAsync();
  }, []);

  async function getUserDetailsAsync() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();

      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <LoadingShimmer style={{ height: 42, width: 180 }} />;
  }

  return (
    <Link href={href} relativeToDirectory push>
      <View style={styles.container}>
        <ProfilePicture avatarUrl={user.avatar_url} />
        <View style={styles.middle}>
          <H4>{user.full_name}</H4>
          <SelectableTag text={tagMessage} showSelectable={false} />
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: Spacings.sm },
  middle: {
    gap: Spacings.xs,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
