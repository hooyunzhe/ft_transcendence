import { Channel, ChannelType } from '@/types/ChannelTypes';
import callAPI from '../callAPI';
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { ChannelMemberStatus, ChannelMember } from '@/types/ChannelMemberTypes';
import { Message } from '@/types/MessageTypes';
import emitToSocket from '../emitToSocket';

interface ChannelStore {
  data: {
    channels: Channel[];
    joinedChannels: boolean[];
    recentChannelActivity: number[];
    selectedChannel: Channel | undefined;
    selectedChannelMuted: boolean;
    unmuteTimeoutID: NodeJS.Timeout | undefined;
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
    setSelectedDirectChannel: (incomingID: number) => void;
    setSelectedChannelMuted: (channelID: number, isMuted: boolean) => void;
    resetSelectedChannel: (channelID: number) => void;
    resetSelectedDirectChannel: (incomingID: number) => void;
    setUnmuteTimeout: (
      mutedUntil: string,
      memberID: number,
      userID: number,
      channelID: number,
      channelSocket: Socket,
    ) => void;
    setupChannelSocketEvents: (
      channelSocket: Socket,
      currentUserID: number,
    ) => void;
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
  const channelData = await callAPI(
    'GET',
    'channels?search_type=ALL&load_relations',
  ).then((res) => res.body);
  const joinedChannelData = await callAPI(
    'GET',
    `users?search_type=RELATION&search_number=${userID}&search_relation=CHANNELS`,
  ).then((res) => res.body);
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
      selectedChannel:
        data.selectedChannel?.id === channelID
          ? { ...data.selectedChannel, name: newName }
          : data.selectedChannel,
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

function setSelectedDirectChannel(
  set: StoreSetter,
  get: StoreGetter,
  incomingID: number,
): void {
  const selectedDirectChannel = get().data.channels.find(
    (channel) =>
      channel.type === ChannelType.DIRECT &&
      channel.name.includes(String(incomingID)),
  );

  if (selectedDirectChannel) {
    setSelectedChannel(set, selectedDirectChannel);
  }
}

function setSelectedChannelMuted(
  set: StoreSetter,
  channelID: number,
  isMuted: boolean,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedChannelMuted:
        data.selectedChannel?.id === channelID
          ? isMuted
          : data.selectedChannelMuted,
    },
  }));
}

function resetSelectedChannel(set: StoreSetter, channelID: number): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedChannel:
        data.selectedChannel?.id === channelID
          ? undefined
          : data.selectedChannel,
    },
  }));
}

function resetSelectedDirectChannel(
  set: StoreSetter,
  incomingID: number,
): void {
  set(({ data }) => ({
    data: {
      ...data,
      selectedChannel:
        data.selectedChannel?.type === ChannelType.DIRECT &&
        data.selectedChannel?.name.includes(String(incomingID))
          ? undefined
          : data.selectedChannel,
    },
  }));
}

async function handleUnmute(
  set: StoreSetter,
  memberID: number,
  userID: number,
  channelID: number,
  channelSocket: Socket,
): Promise<void> {
  await callAPI('PATCH', 'channel-members', {
    id: memberID,
    status: ChannelMemberStatus.DEFAULT,
  });
  emitToSocket(channelSocket, 'changeStatus', {
    memberID: memberID,
    userID: userID,
    channelID: channelID,
    newStatus: ChannelMemberStatus.DEFAULT,
  });
  setSelectedChannelMuted(set, channelID, false);
}

function setUnmuteTimeout(
  set: StoreSetter,
  get: StoreGetter,
  mutedUntil: string,
  memberID: number,
  userID: number,
  channelID: number,
  channelSocket: Socket,
): void {
  clearTimeout(get().data.unmuteTimeoutID);
  if (new Date(mutedUntil).getTime() <= Date.now()) {
    handleUnmute(set, memberID, userID, channelID, channelSocket);
  } else {
    set(({ data }) => ({
      data: {
        ...data,
        unmuteTimeoutID: setTimeout(
          () => handleUnmute(set, memberID, userID, channelID, channelSocket),
          new Date(mutedUntil).getTime() - Date.now(),
        ),
      },
    }));
  }
}

function setupChannelSocketEvents(
  set: StoreSetter,
  get: StoreGetter,
  channelSocket: Socket,
  currentUserID: number,
): void {
  channelSocket.on('newChannel', (channel: Channel) =>
    addChannel(set, channel),
  );
  channelSocket.on('deleteChannel', (channelID: number) => {
    resetSelectedChannel(set, channelID);
    deleteChannel(set, channelID);
  });
  channelSocket.on('newMember', (channelMember: ChannelMember) => {
    if (channelMember.user.id === currentUserID) {
      addJoinedChannel(set, channelMember.channel.id);
      channelSocket.emit('joinRoom', channelMember.channel.id);
    }
  });
  channelSocket.on('kickMember', (channelMember: ChannelMember) => {
    if (channelMember.user.id === currentUserID) {
      resetSelectedChannel(set, channelMember.channel.id);
      deleteJoinedChannel(set, channelMember.channel.id);
      channelSocket.emit('leaveRoom', channelMember.channel.id);
    }
  });
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
      newHash,
    }: {
      id: number;
      newType: ChannelType;
      newHash?: string;
    }) => {
      changeChannelType(set, id, newType);
      if (newType === ChannelType.PROTECTED && newHash)
        changeChannelHash(set, id, newHash);
    },
  );
  channelSocket.on(
    'changeStatus',
    ({
      memberID,
      userID,
      channelID,
      newStatus,
      mutedUntil,
    }: {
      memberID: number;
      userID: number;
      channelID: number;
      newStatus: ChannelMemberStatus;
      mutedUntil: string | undefined;
    }) => {
      if (userID === currentUserID) {
        if (newStatus === ChannelMemberStatus.BANNED) {
          resetSelectedChannel(set, channelID);
        } else if (newStatus === ChannelMemberStatus.MUTED) {
          if (mutedUntil && channelID === get().data.selectedChannel?.id) {
            setUnmuteTimeout(
              set,
              get,
              mutedUntil,
              memberID,
              userID,
              channelID,
              channelSocket,
            );
          }
          setSelectedChannelMuted(set, channelID, true);
        } else if (newStatus === ChannelMemberStatus.DEFAULT) {
          setSelectedChannelMuted(set, channelID, false);
        }
      }
    },
  );
  channelSocket.on('newMessage', (message: Message) =>
    updateRecentChannelActivity(set, message.channel.id),
  );
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
    recentChannelActivity: [],
    selectedChannel: undefined,
    selectedChannelMuted: false,
    unmuteTimeoutID: undefined,
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
    deleteJoinedChannel: (channelID) => deleteJoinedChannel(set, channelID),
    updateRecentChannelActivity: (channelID) =>
      updateRecentChannelActivity(set, channelID),
    setSelectedChannel: (channel) => setSelectedChannel(set, channel),
    setSelectedDirectChannel: (incomingID) =>
      setSelectedDirectChannel(set, get, incomingID),
    setSelectedChannelMuted: (channelID, isMuted) =>
      setSelectedChannelMuted(set, channelID, isMuted),
    resetSelectedChannel: (channelID) => resetSelectedChannel(set, channelID),
    resetSelectedDirectChannel: (incomingID) =>
      resetSelectedDirectChannel(set, incomingID),
    setUnmuteTimeout: (
      mutedUntil,
      memberID,
      userID,
      channelID,
      channelSocket,
    ) =>
      setUnmuteTimeout(
        set,
        get,
        mutedUntil,
        memberID,
        userID,
        channelID,
        channelSocket,
      ),
    setupChannelSocketEvents: (channelSocket, currentUserID) =>
      setupChannelSocketEvents(set, get, channelSocket, currentUserID),
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
export const useSelectedChannelMuted = () =>
  useChannelStore((state) => state.data.selectedChannelMuted);
export const useChannelActions = () =>
  useChannelStore((state) => state.actions);
export const useChannelChecks = () => useChannelStore((state) => state.checks);
