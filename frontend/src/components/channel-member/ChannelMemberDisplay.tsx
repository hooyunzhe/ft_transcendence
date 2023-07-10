import ChannelMembers, {
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
import ChannelMemberMenu from './ChannelMemberMenu';

const TempRole = ChannelMemberRole.MEMBER;

interface ChannelMemberDisplayProps {
  channelMember: ChannelMembers;
  handleAction: (...args: any) => Promise<void>;
}

export function ChannelMemberDisplay({
  channelMember,
  handleAction,
}: ChannelMemberDisplayProps) {
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
            <ChannelMemberMenu
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
