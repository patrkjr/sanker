import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { View } from '../Themed';
import { H3, P } from '../typography';
import { useSupabase } from '@/context/supabase-provider';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import DefaultStyles from '@/constants/DefaultStyles';
import { supabase } from '@/config/supabase';
import ConversationItem from '../ui/ConversationItem';
import Spacings from '@/constants/Spacings';
import { useThemedColors } from '@/hooks/useThemedColors';
import Card from '../ui/Card';

export default function Chats() {
  const { user } = useSupabase();
  const [conversations, setConversations] = useState<[]>([]);

  useEffect(() => {
    getConversationsAsync();
  }, []);

  async function getConversationsAsync() {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`);

      if (data) {
        setConversations(data);
      }
    } catch (error) {
      console.warn(error);
    }
  }

  function getParticipantId(sellerId, buyerId) {
    if (sellerId === user?.id) {
      return buyerId;
    }
    return sellerId;
  }

  function tagMessage(sellerId) {
    if (user?.id === sellerId) {
      return "You're selling";
    }
    return "You're buying";
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="scrollableAxes"
      contentContainerStyle={[pageContainer]}
      nestedScrollEnabled={true}
    >
      <FlatList
        scrollEnabled={false}
        contentContainerStyle={{ gap: Spacings.lg }}
        data={conversations}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <ConversationItem
            href={`/chats/${item.id}`}
            userId={getParticipantId(item?.seller_id, item?.buyer_id)}
            tagMessage={tagMessage(item.seller_id)}
          />
        )}
        ListEmptyComponent={ChatEmptyScreen}
      />
    </ScrollView>
  );
}

function ChatEmptyScreen() {
  return (
    <View style={{ flex: 1, gap: Spacings.md }}>
      <H3>No chats</H3>
      <Card style={styles.emptyContainer}>
        <P>
          Write a seller, or receive a message on your own items, to see chats
          here.
        </P>
      </Card>
    </View>
  );
}

const { pageContainer } = DefaultStyles;

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: Spacings.md,
  },
});
