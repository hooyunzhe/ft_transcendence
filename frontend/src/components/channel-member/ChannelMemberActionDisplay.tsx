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

interface ChannelMemberActionDisplayProps {
  channelMember: ChannelMembers;
  currentRole: ChannelMemberRole;
  handleAction: (...args: any) => Promise<void>;
}

export function ChannelMemberActionDisplay({
  channelMember,
  currentRole,
  handleAction,
}: ChannelMemberActionDisplayProps) {
  return (
    <Paper elevation={2}>
      {channelMember.status !== ChannelMemberStatus.BANNED ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar src={channelMember.user.avatar_url} />
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
              currentUserRole={currentRole}
              handleAction={handleAction}
            />
          ) : null}
        </ListItem>
      ) : null}
    </Paper>
  );
}
