import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import callAPI from '../callAPI';
import { Message } from '@/types/MessageTypes';
import { ChannelMembers } from '@/types/ChannelMemberTypes';

interface ChatStore {
  data: {
    messages: Message[];
    typingMembers: ChannelMembers[];
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
  channelSocket.on('newMessage', (message: Message) =>
    addMessage(set, message),
  );
  channelSocket.on('startTyping', (member: ChannelMembers) => {
    set(({ data }) => ({
      data: {
        ...data,
        typingMembers: [...data.typingMembers, member],
      },
    }));
  });
  channelSocket.on('stopTyping', (member: ChannelMembers) => {
    set(({ data }) => ({
      data: {
        ...data,
        typingMembers: data.typingMembers.filter(
          (typingMember) => typingMember.id !== member.id,
        ),
      },
    }));
  });
}

const useChatStore = create<ChatStore>()((set) => ({
  data: {
    messages: [],
    typingMembers: [],
  },
  actions: {
    getChatData: () => getChatData(set),
    addMessage: (newMessage: Message) => addMessage(set, newMessage),
    setupChatSocketEvents: (channelSocket: Socket) =>
      setupChatSocketEvents(set, channelSocket),
  },
}));

export const useMessages = () => useChatStore((state) => state.data.messages);
export const useTypingMembers = () =>
  useChatStore((state) => state.data.typingMembers);
export const useChatActions = () => useChatStore((state) => state.actions);
