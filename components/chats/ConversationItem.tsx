import { supabase } from '@/config/supabase';
import Spacings from '@/constants/Spacings';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../Themed';
import ProfilePicture from '../profile/ProfilePicture';
import { H4 } from '../typography';
import LoadingShimmer from '../ui/LoadingShimmer';
import SelectableTag from '../ui/SelectableTag';

const MINUTES = 1000 * 60;

export default function ConversationItem({
  userId,
  message = '',
  href,
  tagMessage,
}: {
  userId: string;
  href: { pathname: string; params: {} };
  message: string;
  tagMessage: string;
}) {
  const [user, setUser] = useState<{} | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      //Fetch data on focus and set a interval for regular updates.
      // Should probably be refactored to use realtime database, plus a "last message" field in the conversation table.
      getUserDetailsAsync();
      const intervalId = setInterval(() => {
        getUserDetailsAsync();
      }, 0.1 * MINUTES);

      //Clear the interval when screen is not focused.
      return () => clearInterval(intervalId);
    }, [])
  );

  async function getUserDetailsAsync() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, avatar_url')
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
        <ProfilePicture userId={userId} />
        <View style={styles.middle}>
          <H4>
            {user.first_name} {user.last_name}
          </H4>
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
