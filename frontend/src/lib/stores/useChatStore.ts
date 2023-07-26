import { Message } from '@/types/MessageTypes';
import callAPI from '../callAPI';
import { Socket } from 'socket.io-client';
import { create } from 'zustand';

interface ChatStore {
  data: {
    messages: Message[];
  };
  actions: {
    getChatData: () => void;
    addMessage: (newMessage: Message) => void;
    setupChatSocketEvents: (channelSocket: Socket) => void;
  };
}

type StoreSetter = (helper: (state: ChatStore) => Partial<ChatStore>) => void;

async function getChatData(set: StoreSetter): Promise<void> {
  const messageData = JSON.parse(
    await callAPI('GET', 'messages?search_type=ALL'),
  );

  set(({ data }) => ({
    data: {
      ...data,
      messages: messageData,
    },
  }));
}

function addMessage(set: StoreSetter, newMessage: Message): void {
  set(({ data }) => ({
    data: { ...data, messages: [...data.messages, newMessage] },
  }));
}

function setupChatSocketEvents(set: StoreSetter, channelSocket: Socket): void {
  channelSocket.on('newMessage', (data: Message) => addMessage(set, data));
}

const useChatStore = create<ChatStore>()((set) => ({
  data: {
    messages: [],
  },
  actions: {
    getChatData: () => getChatData(set),
    addMessage: (newMessage: Message) => addMessage(set, newMessage),
    setupChatSocketEvents: (channelSocket: Socket) =>
      setupChatSocketEvents(set, channelSocket),
  },
}));

export const useMessages = () => useChatStore((state) => state.data.messages);
export const useChatActions = () => useChatStore((state) => state.actions);
