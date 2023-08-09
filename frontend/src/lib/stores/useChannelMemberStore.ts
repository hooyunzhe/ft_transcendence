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
    getChannelMember: (
      userID: number,
      channelID: number,
    ) => ChannelMembers | undefined;
    addChannelMember: (channelMember: ChannelMembers) => void;
    kickChannelMember: (memberID: number) => void;
    // kickAllChannelMember: (channelID: number) => void;
    changeChannelMemberRole: (
      memberID: number,
      newRole: ChannelMemberRole,
    ) => void;
    changeChannelMemberStatus: (
      memberID: number,
      newStatus: ChannelMemberStatus,
    ) => void;
    setupChannelMemberSocketEvents: (channelSocket: Socket) => void;
  };
  checks: {
    isChannelOwner: (userID: number, channelID: number) => boolean;
    isChannelAdmin: (userID: number, channelID: number) => boolean;
    isMemberBanned: (userID: number, channelID: number) => boolean;
    isMemberMuted: (userID: number, channelID: number) => boolean;
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

function getChannelMember(
  get: StoreGetter,
  userID: number,
  channelID: number,
): ChannelMembers | undefined {
  return get().data.channelMembers.find(
    (channelMember) =>
      channelMember.user.id === userID &&
      channelMember.channel.id === channelID,
  );
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
      ...data,
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
      ...data,
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
  channelSocket: Socket,
): void {
  channelSocket.on('newMember', (member: ChannelMembers) =>
    addChannelMember(set, member),
  );
  channelSocket.on('kickMember', (member: ChannelMembers) =>
    kickChannelMember(set, member.id),
  );
  channelSocket.on(
    'changeRole',
    ({ memberID, newRole }: { memberID: number; newRole: ChannelMemberRole }) =>
      changeChannelMemberRole(set, memberID, newRole),
  );
  channelSocket.on(
    'changeStatus',
    ({
      memberID,
      newStatus,
    }: {
      memberID: number;
      newStatus: ChannelMemberStatus;
    }) => changeChannelMemberStatus(set, memberID, newStatus),
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

function isChannelAdmin(
  get: StoreGetter,
  userID: number,
  channelID: number,
): boolean {
  return get().data.channelMembers.some(
    (localMember) =>
      localMember.user.id === userID &&
      localMember.channel.id === channelID &&
      localMember.role === ChannelMemberRole.ADMIN,
  );
}

function isMemberBanned(
  get: StoreGetter,
  userID: number,
  channelID: number,
): boolean {
  return get().data.channelMembers.some(
    (localMember) =>
      localMember.user.id === userID &&
      localMember.channel.id === channelID &&
      localMember.status === ChannelMemberStatus.BANNED,
  );
}

function isMemberMuted(
  get: StoreGetter,
  userID: number,
  channelID: number,
): boolean {
  return get().data.channelMembers.some(
    (localMember) =>
      localMember.user.id === userID &&
      localMember.channel.id === channelID &&
      localMember.status === ChannelMemberStatus.MUTED,
  );
}

const useChannelMemberStore = create<ChannelMemberStore>()((set, get) => ({
  data: { channelMembers: [] },
  actions: {
    getChannelMemberData: () => getChannelMemberData(set),
    getChannelMember: (userID, channelID) =>
      getChannelMember(get, userID, channelID),
    addChannelMember: (channelMember) => addChannelMember(set, channelMember),
    kickChannelMember: (memberID) => kickChannelMember(set, memberID),
    changeChannelMemberRole: (memberID, newRole) =>
      changeChannelMemberRole(set, memberID, newRole),
    changeChannelMemberStatus: (memberID, newStatus) =>
      changeChannelMemberStatus(set, memberID, newStatus),
    setupChannelMemberSocketEvents: (channelSocket) =>
      setupChannelMemberSocketEvents(set, channelSocket),
  },
  checks: {
    isChannelOwner: (userID, channelID) =>
      isChannelOwner(get, userID, channelID),
    isChannelAdmin: (userID, channelID) =>
      isChannelAdmin(get, userID, channelID),
    isMemberBanned: (userID, channelID) =>
      isMemberBanned(get, userID, channelID),
    isMemberMuted: (userID, channelID) => isMemberMuted(get, userID, channelID),
  },
}));

export const useChannelMembers = () =>
  useChannelMemberStore((state) => state.data.channelMembers);
export const useChannelMemberActions = () =>
  useChannelMemberStore((state) => state.actions);
export const useChannelMemberChecks = () =>
  useChannelMemberStore((state) => state.checks);
