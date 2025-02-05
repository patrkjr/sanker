import { supabase } from '@/config/supabase';
import { create } from 'zustand';

// Defines the shape of the conversation state within the store
interface ConversationState {
  conversation: any; // The current conversation object
  isFetching: boolean; // Indicates if a fetch operation is in progress
  messages: Array<Record<string, any>>; // List of messages in the conversation
  error: string | null; // Error message if an error occurred
  resetConversation: () => void; // Function to reset the conversation state
  fetchConversation: (id: string) => Promise<void>; // Function to fetch a conversation by ID
  createConversation: (conversation: ConversationParams) => Promise<string>;
  subscribeToMessages: (id: string) => () => void; // Function to subscribe to message updates
}

interface ConversationParams {
  buyer_id: string | string[];
  seller_id: string | string[];
  item_id: string | string[];
}
// Creates a store to manage conversation state using Zustand
export const useConversationStore = create<ConversationState>((set) => ({
  conversation: null,
  isFetching: false,
  messages: [],
  error: null,
  // Fetches conversation details and messages from the database
  fetchConversation: async (id) => {
    set((state) => ({ ...state, isFetching: true }));
    // Validates if the provided ID is a valid bigint
    if (!/^\d+$/.test(id)) {
      console.warn('Invalid conversation ID:', id);
      set({
        conversation: null,
        messages: [],
        isFetching: false,
        error: `"${id}" is not a valid conversation ID`,
      });
      return;
    }
    try {
      // Fetches the conversation details
      const { data: conversationData, error: conversationError } =
        await supabase.from('conversations').select('*').eq('id', id).single();

      if (conversationError) {
        set((state) => ({
          ...state,
          error: conversationError.message,
          isFetching: false,
        }));
        console.error('Error fetching conversation:', conversationError);
        return;
      }

      // Fetches the messages for the conversation
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: false });

      if (messagesError) {
        set((state) => ({
          ...state,
          error: messagesError.message,
          isFetching: false,
        }));
        console.warn('Error fetching messages:', messagesError);
        return;
      }

      // Updates the store with the fetched conversation and messages
      set({
        conversation: { ...conversationData, messages: messagesData },
        isFetching: false,
      });
    } catch (error: any) {
      // Error type is any to handle unknown error types
      set((state) => ({ ...state, error: error.message, isFetching: false }));
      console.error('Error:', error);
    }
  },
  // Creates a new conversation in the database
  createConversation: async (conversation) => {
    try {
      // Inserts the new conversation into the database
      // Type annotation made by AI here. Might be bad.
      const {
        data,
        error: createError,
      }: {
        data: { id: string; [key: string]: any } | null;
        error: Error | null;
      } = await supabase
        .from('conversations')
        .insert(conversation)
        .select('*')
        .single();

      if (createError) {
        set((state) => ({
          ...state,
          error: createError.message,
          isFetching: false,
        }));
        console.error('Error creating conversation:', createError);
        return;
      }

      // Updates the store with the new conversation
      if (data) {
        set((state) => ({
          ...state,
          conversation: { ...conversation, messages: [] },
          isFetching: false,
          error: null,
        }));
        return data.id;
      }
    } catch (error: any) {
      // Error type is any to handle unknown error types
      set((state) => ({ ...state, error: error.message, isFetching: false }));
      console.error('Error:', error);
    }
  },
  // Resets the conversation state to its initial values
  resetConversation: () =>
    set({
      conversation: null,
      isFetching: false,
      messages: [],
      error: null,
    }),
  // Subscribes to new message events for the conversation
  subscribeToMessages: (id) => {
    const subscription = supabase
      .channel('chat_room')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          // Updates the store with the new message
          set((state) => ({
            ...state,
            conversation: {
              ...state.conversation,
              messages: [payload.new, ...state.conversation.messages],
            },
          }));
        }
      )
      .subscribe();

    // Returns a function to unsubscribe from the channel
    return () => supabase.removeChannel(subscription);
  },
}));
