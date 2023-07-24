import {
  ChannelMemberRole,
  ChannelMemberStatus,
  ChannelMembers,
} from '@/types/ChannelMemberTypes';
import { create } from 'zustand';
import callAPI from '../callAPI';
import { Socket } from 'socket.io-client';

interface ChannelMemberStore {
  data: {
    channelMembers: ChannelMembers[];
  };
  actions: {
    getChannelMemberData: () => void;
    addChannelMember: (channelMember: ChannelMembers) => void;
    kickChannelMember: (memberID: number) => void;
    changeChannelMemberRole: (
      memberID: number,
      newRole: ChannelMemberRole,
    ) => void;
    changeChannelMemberStatus: (
      memberID: number,
      newStatus: ChannelMemberStatus,
    ) => void;
    setupChannelMemberSocketEvents: (
      channelMemberSocket: Socket,
      memberID: number,
    ) => void;
  };
  checks: {
    isChannelOwner: (userID: number, channelID: number) => boolean;
  };
}

type StoreSetter = (
  helper: (state: ChannelMemberStore) => Partial<ChannelMemberStore>,
) => void;

type StoreGetter = () => ChannelMemberStore;

async function getChannelMemberData(set: StoreSetter): Promise<void> {
  const channelMembersData = JSON.parse(
    await callAPI('GET', 'channel-members?search_type=ALL'),
  );
  set(() => ({ data: { channelMembers: channelMembersData } }));
}

function addChannelMember(
  set: StoreSetter,
  channelMember: ChannelMembers,
): void {
  set(({ data }) => ({
    data: { channelMembers: [...data.channelMembers, channelMember] },
  }));
}

function kickChannelMember(set: StoreSetter, memberID: number): void {
  set(({ data }) => ({
    data: {
      channelMembers: data.channelMembers.filter(
        (localMember) => localMember.id !== memberID,
      ),
    },
  }));
}

function changeChannelMemberRole(
  set: StoreSetter,
  memberID: number,
  newRole: ChannelMemberRole,
): void {
  set(({ data }) => ({
    data: {
      channelMembers: data.channelMembers.map((localMember) => {
        if (localMember.id === memberID) {
          localMember.role = newRole;
        }
        return localMember;
      }),
    },
  }));
}

function changeChannelMemberStatus(
  set: StoreSetter,
  memberID: number,
  newStatus: ChannelMemberStatus,
): void {
  set(({ data }) => ({
    data: {
      channelMembers: data.channelMembers.map((localMember) => {
        if (localMember.id === memberID) {
          localMember.status = newStatus;
        }
        return localMember;
      }),
    },
  }));
}

function setupChannelMemberSocketEvents(
  set: StoreSetter,
  channelMemberSocket: Socket,
  memberID: number,
): void {
  channelMemberSocket.on('socketConnected', () =>
    channelMemberSocket.emit('initConnection', memberID),
  );
  channelMemberSocket.on('newUser', (request: ChannelMembers) =>
    addChannelMember(set, request),
  );
  channelMemberSocket.on('kickUser', (request: ChannelMembers) =>
    kickChannelMember(set, request.id),
  );
  channelMemberSocket.on(
    'changeRole',
    (request: ChannelMembers, newRole: ChannelMemberRole) =>
      changeChannelMemberRole(set, request.id, newRole),
  );
  channelMemberSocket.on(
    'changeStatus',
    (request: ChannelMembers, newStatus: ChannelMemberStatus) =>
      changeChannelMemberStatus(set, request.id, newStatus),
  );
}

function isChannelOwner(
  get: StoreGetter,
  userID: number,
  channelID: number,
): boolean {
  return get().data.channelMembers.some(
    (localMember) =>
      localMember.user.id === userID &&
      localMember.channel.id === channelID &&
      localMember.role === ChannelMemberRole.OWNER,
  );
}

const useChannelMemberStore = create<ChannelMemberStore>()((set, get) => ({
  data: { channelMembers: [] },
  actions: {
    getChannelMemberData: () => getChannelMemberData(set),
    addChannelMember: (channelMember) => addChannelMember(set, channelMember),
    kickChannelMember: (memberID) => kickChannelMember(set, memberID),
    changeChannelMemberRole: (memberID, newRole) =>
      changeChannelMemberRole(set, memberID, newRole),
    changeChannelMemberStatus: (memberID, newStatus) =>
      changeChannelMemberStatus(set, memberID, newStatus),
    setupChannelMemberSocketEvents: (channelMemberSocket, memberID) =>
      setupChannelMemberSocketEvents(set, channelMemberSocket, memberID),
  },
  checks: {
    isChannelOwner: (userID, channelID) =>
      isChannelOwner(get, userID, channelID),
  },
}));

export const useChannelMembers = () =>
  useChannelMemberStore((state) => state.data.channelMembers);
export const useChannelMemberActions = () =>
  useChannelMemberStore((state) => state.actions);
export const useChannelMemberChecks = () =>
  useChannelMemberStore((state) => state.checks);
