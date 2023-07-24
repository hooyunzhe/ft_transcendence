'use client';
import {
  ChannelMembers,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import ChannelMemberActionMenu from './ChannelMemberActionMenu';

const TempRole = ChannelMemberRole.OWNER;

interface ChannelMemberActionDisplayProps {
  channelMember: ChannelMembers;
  handleAction: (...args: any) => Promise<void>;
}

export function ChannelMemberActionDisplay({
  channelMember,
  handleAction,
}: ChannelMemberActionDisplayProps) {
  return (
    <Paper elevation={2}>
      {channelMember.status !== ChannelMemberStatus.BANNED ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar alt=''></Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={channelMember.user.username}
            secondary={
              'User Id: ' +
              channelMember.user.id +
              ' role: ' +
              channelMember.role
            }
          />
          {channelMember.role !== ChannelMemberRole.OWNER ? (
            <ChannelMemberActionMenu
              channelMember={channelMember}
              currentUserRole={TempRole}
              handleAction={handleAction}
            />
          ) : null}
        </ListItem>
      ) : null}
    </Paper>
  );
}
