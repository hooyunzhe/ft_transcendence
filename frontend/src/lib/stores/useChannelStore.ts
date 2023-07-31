import { Channel, ChannelType } from '@/types/ChannelTypes';
import callAPI from '../callAPI';
import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface ChannelStore {
  data: {
    channels: Channel[];
    joinedChannels: boolean[];
    recentChannelActivity: number[];
    selectedChannel: Channel | undefined;
  };
  actions: {
    getChannelData: (userID: number) => void;
    addChannel: (newChannel: Channel) => void;
    addJoinedChannel: (channelID: number) => void;
    changeChannelName: (channelID: number, newName: string) => void;
    changeChannelType: (channelID: number, newType: ChannelType) => void;
    changeChannelHash: (channelID: number, newHash: string) => void;
    deleteChannel: (channelID: number) => void;
    deleteJoinedChannel: (channelID: number) => void;
    updateRecentChannelActivity: (channelID: number) => void;
    setSelectedChannel: (channel: Channel | undefined) => void;
    setupChannelSocketEvents: (channelSocket: Socket) => void;
  };
  checks: {
    checkChannelExists: (channelName: string) => boolean;
    checkChannelJoined: (channelName: string) => boolean;
  };
}

type StoreSetter = (
  helper: (state: ChannelStore) => Partial<ChannelStore>,
) => void;
type StoreGetter = () => ChannelStore;

async function getChannelData(set: StoreSetter, userID: number): Promise<void> {
  const channelData = JSON.parse(
    await callAPI('GET', 'channels?search_type=ALL&load_relations'),
  );
  const joinedChannelData = JSON.parse(
    await callAPI(
      'GET',
      `users?search_type=RELATION&search_number=${userID}&search_relation=CHANNELS`,
    ),
  );
  const joinedChannelLookup: boolean[] = [];
  const recentChannelActivity: number[] = [];

  joinedChannelData.forEach((joinedChannel: Channel) => {
    joinedChannelLookup[joinedChannel.id] = true;
  });
  channelData.forEach((channel: Channel) => {
    if (joinedChannelLookup[channel.id]) {
      const latestMember = channel.channelMembers.slice(-1)[0];
      const latestMessage = channel.messages.slice(-1)[0];

      recentChannelActivity[channel.id] = Math.max(
        Date.parse(channel.last_updated),
        Date.parse(latestMember.last_updated),
        Date.parse(latestMessage?.date_of_creation ?? '0'),
      );
    }
  });

  set(({ data }) => ({
    data: {
      ...data,
      channels: channelData,
      joinedChannels: joinedChannelLookup,
      recentChannelActivity: recentChannelActivity,
    },
  }));
}

function addChannel(set: StoreSetter, newChannel: Channel): void {
  set(({ data }) => ({
    data: { ...data, channels: [...data.channels, newChannel] },
  }));
  updateRecentChannelActivity(set, newChannel.id);
}

function addJoinedChannel(set: StoreSetter, channelID: number): void {
  set(({ data }) => {
    const updatedJoinedChannels = [...data.joinedChannels];

    updatedJoinedChannels[channelID] = true;
    return {
      data: {
        ...data,
        joinedChannels: updatedJoinedChannels,
      },
    };
  });
  updateRecentChannelActivity(set, channelID);
}

function changeChannelName(
  set: StoreSetter,
  channelID: number,
  newName: string,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      channels: data.channels.map((channel) => {
        if (channel.id === channelID) {
          channel.name = newName;
        }
        return channel;
      }),
    },
  }));
  updateRecentChannelActivity(set, channelID);
}

function changeChannelType(
  set: StoreSetter,
  channelID: number,
  newType: ChannelType,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      channels: data.channels.map((channel) => {
        if (channel.id === channelID) {
          channel.type = newType;
        }
        return channel;
      }),
    },
  }));
  updateRecentChannelActivity(set, channelID);
}

function changeChannelHash(
  set: StoreSetter,
  channelID: number,
  newHash: string,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      channels: data.channels.map((channel) => {
        if (channel.id === channelID) {
          channel.hash = newHash;
        }
        return channel;
      }),
    },
  }));
  updateRecentChannelActivity(set, channelID);
}

function deleteChannel(set: StoreSetter, channelID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      channels: data.channels.filter((channel) => channel.id !== channelID),
    },
  }));
}

function deleteJoinedChannel(set: StoreSetter, channelID: number): void {
  set(({ data }) => {
    const updatedDeletedJoinedChannels = [...data.joinedChannels];

    updatedDeletedJoinedChannels[channelID] = false;
    return {
      data: {
        ...data,
        joinedChannels: updatedDeletedJoinedChannels,
      },
    };
  });
}

function updateRecentChannelActivity(
  set: StoreSetter,
  channelID: number,
): void {
  set(({ data }) => {
    const updatedRecentChannelActivity = [...data.recentChannelActivity];

    updatedRecentChannelActivity[channelID] = new Date().getTime();
    return {
      data: {
        ...data,
        recentChannelActivity: updatedRecentChannelActivity,
      },
    };
  });
}

function setSelectedChannel(
  set: StoreSetter,
  channel: Channel | undefined,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedChannel: channel,
    },
  }));
}

function checkChannelExists(get: StoreGetter, channelName: string): boolean {
  return get().data.channels.some((channel) => channel.name === channelName);
}

function checkChannelJoined(get: StoreGetter, channelName: string): boolean {
  const channel = get().data.channels.find(
    (channel) => channel.name === channelName,
  );

  if (channel) {
    return get().data.joinedChannels[channel.id];
  }
  return false;
}

function setupChannelSocketEvents(
  set: StoreSetter,
  channelSocket: Socket,
): void {
  channelSocket.on('newChannel', (channel: Channel) =>
    addChannel(set, channel),
  );
  channelSocket.on('joinChannel', (channel: Channel) => {
    channelSocket.emit('joinRoom', channel.id);
    addJoinedChannel(set, channel.id);
  });
  channelSocket.on('deleteChannel', (channel: Channel) =>
    deleteChannel(set, channel.id),
  );
  channelSocket.on(
    'changeChannelName',
    ({ id, newName }: { id: number; newName: string }) =>
      changeChannelName(set, id, newName),
  );
  channelSocket.on(
    'changeChannelType',
    ({
      id,
      newType,
      newPass,
    }: {
      id: number;
      newType: ChannelType;
      newPass?: string;
    }) => {
      changeChannelType(set, id, newType);
      if (newType == ChannelType.PROTECTED && newPass)
        changeChannelHash(set, id, newPass);
    },
  );

  channelSocket.on('newChannel', (data: Channel) => addChannel(set, data));
  channelSocket.on('deleteChannel', (data: Channel) =>
    deleteChannel(set, data.id),
  );
  channelSocket.on(
    'changeChannelName',
    (data: { id: number; newName: string }) =>
      changeChannelName(set, data.id, data.newName),
  );
  channelSocket.on(
    'changeChannelType',
    (data: { id: number; newType: ChannelType; newPass?: string }) => {
      changeChannelType(set, data.id, data.newType);
      if (data.newType == ChannelType.PROTECTED && data.newPass)
        changeChannelHash(set, data.id, data.newPass);
    },
  );
}

const useChannelStore = create<ChannelStore>()((set, get) => ({
  data: {
    channels: [],
    joinedChannels: [],
    recentChannelActivity: [],
    selectedChannel: undefined,
  },
  actions: {
    getChannelData: (userID) => getChannelData(set, userID),
    addChannel: (newChannel) => addChannel(set, newChannel),
    addJoinedChannel: (channelID) => addJoinedChannel(set, channelID),
    changeChannelName: (channelID, newName) =>
      changeChannelName(set, channelID, newName),
    changeChannelType: (channelID, newType) =>
      changeChannelType(set, channelID, newType),
    changeChannelHash: (channelID, newHash) =>
      changeChannelHash(set, channelID, newHash),
    deleteChannel: (channelID) => deleteChannel(set, channelID),
    updateRecentChannelActivity: (channelID) =>
      updateRecentChannelActivity(set, channelID),
    setSelectedChannel: (channel) => setSelectedChannel(set, channel),
    setupChannelSocketEvents: (channelSocket) =>
      setupChannelSocketEvents(set, channelSocket),
    deleteJoinedChannel: (channelID) => deleteJoinedChannel(set, channelID),
  },
  checks: {
    checkChannelExists: (channelName) => checkChannelExists(get, channelName),
    checkChannelJoined: (channelName) => checkChannelJoined(get, channelName),
  },
}));

export const useChannels = () =>
  useChannelStore((state) => state.data.channels);
export const useJoinedChannels = () =>
  useChannelStore((state) => state.data.joinedChannels);
export const useRecentChannelActivity = () =>
  useChannelStore((state) => state.data.recentChannelActivity);
export const useSelectedChannel = () =>
  useChannelStore((state) => state.data.selectedChannel);
export const useChannelActions = () =>
  useChannelStore((state) => state.actions);
export const useChannelChecks = () => useChannelStore((state) => state.checks);
