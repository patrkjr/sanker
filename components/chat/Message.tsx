import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { View } from '../Themed';
import { useSupabase } from '@/context/supabase-provider';
import { P } from '../typography';
import Spacings from '@/constants/Spacings';
import ProfilePicture from '../profile/ProfilePicture';
import { useThemedColors } from '@/hooks/useThemedColors';

interface MessageProps {
  senderId: string;
  content: string;
}

export default function Message({ senderId, content }: MessageProps) {
  const { user } = useSupabase();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const senderIsUser = senderId === user?.id;

  const colors = useThemedColors();

  //TODO: get profile picture of user

  return (
    <View style={[styles.container, senderIsUser && styles.senderFlex]}>
      <View
        style={[
          { backgroundColor: colors.card },
          styles.messageContainer,
          senderIsUser && {
            ...styles.senderFlex,
            backgroundColor: colors.themed.card,
          },
        ]}
      >
        <P style={senderIsUser && { textAlign: 'right' }}>{content}</P>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  messageContainer: {
    flexDirection: 'row',
    borderRadius: Spacings.borderRadius.xl,
    padding: Spacings.sm,
    paddingHorizontal: Spacings.md,
    maxWidth: '90%',
  },
  senderFlex: {
    flexDirection: 'row-reverse',
  },
});
