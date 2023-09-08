'use client';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Box,
  ListItemIcon,
} from '@mui/material';
import {
  AccountCircleRounded,
  AdminPanelSettingsRounded,
  ExitToAppRounded,
  LockPersonRounded,
} from '@mui/icons-material';
import ChannelSettings from './ChannelSettings';
import callAPI from '@/lib/callAPI';
import emitToSocket from '@/lib/emitToSocket';
import { useChannelSocket } from '@/lib/stores/useSocketStore';
import { useChannelActions } from '@/lib/stores/useChannelStore';
import { useChannelMemberActions } from '@/lib/stores/useChannelMemberStore';
import { useConfirmationActions } from '@/lib/stores/useConfirmationStore';
import { ChannelType } from '@/types/ChannelTypes';
import { ChannelMember, ChannelMemberRole } from '@/types/ChannelMemberTypes';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

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

export default function ChannelDisplay({
  channelID,
  channelName,
  channelType,
  channelHash,
  isOwner,
  currentChannelMember,
  selected,
  selectCurrent,
}: ChannelDisplayProps) {
  const channelSocket = useChannelSocket();
  const { deleteJoinedChannel, resetSelectedChannel } = useChannelActions();
  const { kickChannelMember, deleteChannelMembers } = useChannelMemberActions();
  const { displayConfirmation, resetConfirmation } = useConfirmationActions();
  const { displayNotification } = useNotificationActions();

  async function leaveChannel(
    leavingChannelMember: ChannelMember,
  ): Promise<void> {
    if (leavingChannelMember.role === ChannelMemberRole.OWNER) {
      displayNotification(
        'error',
        'You are now the owner of the channel, unable to leave',
      );
      resetConfirmation();
    } else {
      await callAPI('DELETE', 'channel-members', {
        id: leavingChannelMember.id,
      });
      kickChannelMember(leavingChannelMember.id);
      deleteChannelMembers(leavingChannelMember.channel.id);
      deleteJoinedChannel(leavingChannelMember.channel.id);
      emitToSocket(channelSocket, 'kickMember', leavingChannelMember);
      emitToSocket(channelSocket, 'leaveRoom', leavingChannelMember.channel.id);
      resetSelectedChannel(leavingChannelMember.channel.id);
      displayNotification(
        'info',
        `You have left ${leavingChannelMember.channel.name}`,
      );
    }
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
    <Box border='solid 3px #a23833' borderRadius='10px' bgcolor='#A4B5C6'>
      <ListItem>
        <ListItemButton
          selected={selected}
          onMouseDown={(event) => event.preventDefault()}
          onClick={selectCurrent}
        >
          <ListItemAvatar>
            <Avatar sx={{ border: 'solid 1px black', bgcolor: '#11111180' }}>
              {channelName.charAt(0)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={channelName} sx={{ wordBreak: 'break-all' }} />
          <ListItemIcon sx={{ minWidth: '0px' }}>
            {channelType === ChannelType.PUBLIC && <AccountCircleRounded />}
            {channelType === ChannelType.PRIVATE && (
              <AdminPanelSettingsRounded />
            )}
            {channelType === ChannelType.PROTECTED && <LockPersonRounded />}
          </ListItemIcon>
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
              onMouseDown={(event) => event.preventDefault()}
              onClick={() =>
                leaveChannelConfirmation(channelName, currentChannelMember)
              }
            >
              <ExitToAppRounded />
            </IconButton>
          )
        )}
      </ListItem>
    </Box>
  );
}
