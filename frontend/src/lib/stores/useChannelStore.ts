import { Channel, ChannelType } from '@/types/ChannelTypes';
import callAPI from '../callAPI';
import { create } from 'zustand';

interface ChannelStore {
  data: {
    channels: Channel[];
    joinedChannels: boolean[];
  };
  actions: {
    getChannelData: (userID: number) => void;
    addChannel: (newChannel: Channel) => void;
    addJoinedChannel: (channelID: number) => void;
    changeChannelName: (channelID: number, newName: string) => void;
    changeChannelType: (channelID: number, newType: ChannelType) => void;
    deleteChannel: (channelID: number) => void;
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
  const channelData = JSON.parse(await callAPI('GET', 'channels'));
  const joinedChannelData = JSON.parse(
    await callAPI(
      'GET',
      `users?search_type=RELATION&search_number=${userID}&search_relation=CHANNELS`,
    ),
  );
  let joinedChannelLookup: boolean[] = [];

  joinedChannelData.forEach((joinedChannel: Channel) => {
    joinedChannelLookup[joinedChannel.id] = true;
  });
  set(() => ({
    data: {
      channels: channelData,
      joinedChannels: joinedChannelLookup,
    },
  }));
}

function addChannel(set: StoreSetter, newChannel: Channel): void {
  set(({ data }) => ({
    data: { ...data, channels: [...data.channels, newChannel] },
  }));
}

function addJoinedChannel(set: StoreSetter, channelID: number): void {
  set(({ data }) => {
    data.joinedChannels[channelID] = true;
    return { data };
  });
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
}

function deleteChannel(set: StoreSetter, channelID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      channels: data.channels.filter((channel) => channel.id !== channelID),
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

const useChannelStore = create<ChannelStore>()((set, get) => ({
  data: {
    channels: [],
    joinedChannels: [],
  },
  actions: {
    getChannelData: (userID) => getChannelData(set, userID),
    addChannel: (newChannel) => addChannel(set, newChannel),
    addJoinedChannel: (channelID) => addJoinedChannel(set, channelID),
    changeChannelName: (channelID, newName) =>
      changeChannelName(set, channelID, newName),
    changeChannelType: (channelID, newType) =>
      changeChannelType(set, channelID, newType),
    deleteChannel: (channelID) => deleteChannel(set, channelID),
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
export const useChannelActions = () =>
  useChannelStore((state) => state.actions);
export const useChannelChecks = () => useChannelStore((state) => state.checks);
