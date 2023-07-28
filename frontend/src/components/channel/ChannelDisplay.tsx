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
import { ChannelMembers } from '@/types/ChannelMemberTypes';

export interface ChannelDisplayProps {
  channelID: number;
  channelName: string;
  channelType: ChannelType;
  channelHash: string;
  currentChannelMember: ChannelMembers | undefined;
  selected: boolean;
  selectCurrent: () => void;
  isOwner: boolean;
}

export function ChannelDisplay({
  channelID,
  channelName,
  channelType,
  channelHash,
  currentChannelMember,
  selected,
  selectCurrent,
  isOwner,
}: ChannelDisplayProps) {
  const { kickChannelMember } = useChannelMemberActions();
  const { displayConfirmation } = useConfirmationActions();
  const { deleteJoinedChannel } = useChannelActions();

  async function leaveChannel(
    leavingChannelMember: ChannelMembers,
  ): Promise<string> {
    await callAPI('DELETE', 'channel-members', { id: leavingChannelMember.id });
    kickChannelMember(leavingChannelMember.id);
    deleteJoinedChannel(leavingChannelMember.channel.id);
    return '';
  }

  async function leaveChannelConfirmation(
    channelName: string,
    leavingChannelMember: ChannelMembers | undefined,
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
      <ListItemButton selected={selected} onClick={selectCurrent}>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt=''></Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={channelName}
            secondary={'Channel ID: ' + channelID}
          />
          {channelType === ChannelType.PUBLIC && <AccountCircleRounded />}
          {channelType === ChannelType.PRIVATE && <AdminPanelSettingsRounded />}
          {channelType === ChannelType.PROTECTED && <LockPersonRounded />}
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
      </ListItemButton>
    </Paper>
  );
}
