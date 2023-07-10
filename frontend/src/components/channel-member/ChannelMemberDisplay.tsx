import ChannelMembers, { ChannelMemberRole } from '@/types/ChannelMemberTypes';

import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';
import ChannelMemberMenu from './ChannelMemberMenu';

const TempRole = ChannelMemberRole.OWNER;

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
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={channelMember.user.username}
          secondary={
            'User Id: ' + channelMember.user.id + ' role: ' + channelMember.role
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
    </Paper>
  );
}
