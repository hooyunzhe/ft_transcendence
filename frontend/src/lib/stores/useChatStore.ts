import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import callAPI from '../callAPI';
import { Message, MessageType } from '@/types/MessageTypes';
import { ChannelMember } from '@/types/ChannelMemberTypes';

interface ChatStore {
  data: {
    messages: Message[];
    selectedMessage: Message | undefined;
    typingMembers: ChannelMember[];
  };
  actions: {
    getChatData: () => void;
    addMessage: (newMessage: Message) => void;
    editMessage: (messageID: number, newContent: string) => void;
    deleteMessage: (messageID: number) => void;
    setSelectedMessage: (message: Message | undefined) => void;
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

function editMessage(
  set: StoreSetter,
  messageID: number,
  newContent: string,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      messages: data.messages.map((message) =>
        message.id === messageID
          ? {
              ...message,
              content: newContent,
              last_updated: new Date().toISOString(),
            }
          : message,
      ),
    },
  }));
}

function deleteMessage(set: StoreSetter, messageID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      messages: data.messages.map((message) =>
        message.id === messageID
          ? { ...message, type: MessageType.DELETED }
          : message,
      ),
    },
  }));
}

function newTypingMember(set: StoreSetter, member: ChannelMember): void {
  set(({ data }) => ({
    data: {
      ...data,
      typingMembers: [...data.typingMembers, member],
    },
  }));
}

function deleteTypingMember(set: StoreSetter, memberID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      typingMembers: data.typingMembers.filter(
        (typingMember) => typingMember.id !== memberID,
      ),
    },
  }));
}

function setSelectedMessage(
  set: StoreSetter,
  message: Message | undefined,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedMessage: message,
    },
  }));
}

function setupChatSocketEvents(set: StoreSetter, channelSocket: Socket): void {
  channelSocket.on('newMessage', (message: Message) =>
    addMessage(set, message),
  );
  channelSocket.on(
    'editMessage',
    ({ messageID, content }: { messageID: number; content: string }) =>
      editMessage(set, messageID, content),
  );
  channelSocket.on('deleteMessage', (message: Message) =>
    deleteMessage(set, message.id),
  );
  channelSocket.on('startTyping', (member: ChannelMember) =>
    newTypingMember(set, member),
  );
  channelSocket.on('stopTyping', (member: ChannelMember) =>
    deleteTypingMember(set, member.id),
  );
}

const useChatStore = create<ChatStore>()((set) => ({
  data: {
    messages: [],
    selectedMessage: undefined,
    typingMembers: [],
  },
  actions: {
    getChatData: () => getChatData(set),
    addMessage: (newMessage) => addMessage(set, newMessage),
    editMessage: (messageID, newContent) =>
      editMessage(set, messageID, newContent),
    deleteMessage: (messageID) => deleteMessage(set, messageID),
    setSelectedMessage: (message) => setSelectedMessage(set, message),
    setupChatSocketEvents: (channelSocket) =>
      setupChatSocketEvents(set, channelSocket),
  },
}));

export const useMessages = () => useChatStore((state) => state.data.messages);
export const useSelectedMessage = () =>
  useChatStore((state) => state.data.selectedMessage);
export const useTypingMembers = () =>
  useChatStore((state) => state.data.typingMembers);
export const useChatActions = () => useChatStore((state) => state.actions);
