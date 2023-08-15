'use client';
import { ChannelType } from '@/types/ChannelTypes';
import {
  AccountCircleRounded,
  AdminPanelSettingsRounded,
  ExitToAppRounded,
  LockPersonRounded,
} from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import ChannelSettings from './ChannelSettings';
import callAPI from '@/lib/callAPI';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { ChannelMember } from '@/types/ChannelMemberTypes';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';

export interface ChannelDisplayProps {
  channelID: number;
  channelName: string;
  channelType: ChannelType;
  channelHash: string;
  currentChannelMember: ChannelMember | undefined;
  selected: boolean;
  selectCurrent: () => void;
  isOwner: boolean;
}

export function ChannelDisplay({
  channelID,
  channelName,
  channelType,
  channelHash,
  isOwner,
  currentChannelMember,
  selected,
  selectCurrent,
}: ChannelDisplayProps) {
  const { kickChannelMember, deleteChannelMembers } = useChannelMemberActions();
  const { displayConfirmation } = useConfirmationActions();
  const { deleteJoinedChannel, resetSelectedChannel } = useChannelActions();
  const channelSocket = useChannelSocket();

  async function leaveChannel(
    leavingChannelMember: ChannelMember,
  ): Promise<void> {
    await callAPI('DELETE', 'channel-members', { id: leavingChannelMember.id });
    kickChannelMember(leavingChannelMember.id);
    deleteChannelMembers(leavingChannelMember.channel.id);
    deleteJoinedChannel(leavingChannelMember.channel.id);
    emitToSocket(channelSocket, 'kickMember', leavingChannelMember);
    emitToSocket(channelSocket, 'leaveRoom', leavingChannelMember.channel.id);
    resetSelectedChannel(leavingChannelMember.channel.id);
  }

  async function leaveChannelConfirmation(
    channelName: string,
    leavingChannelMember: ChannelMember | undefined,
  ) {
    displayConfirmation(
      'You are leaving ' + channelName + '?',
      'Is this goodbye?',
      leavingChannelMember,
      leaveChannel,
    );
    return;
  }

  return (
    <Paper elevation={2}>
      <ListItem>
        <ListItemButton selected={selected} onClick={selectCurrent}>
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText primary={channelName} />
          {channelType === ChannelType.PUBLIC && <AccountCircleRounded />}
          {channelType === ChannelType.PRIVATE && <AdminPanelSettingsRounded />}
          {channelType === ChannelType.PROTECTED && <LockPersonRounded />}
        </ListItemButton>
        {isOwner ? (
          <ChannelSettings
            channelID={channelID}
            channelName={channelName}
            channelType={channelType}
            channelHash={channelHash}
          />
        ) : (
          currentChannelMember && (
            <IconButton
              onClick={() =>
                leaveChannelConfirmation(channelName, currentChannelMember)
              }
            >
              <ExitToAppRounded />
            </IconButton>
          )
        )}
      </ListItem>
    </Paper>
  );
}
