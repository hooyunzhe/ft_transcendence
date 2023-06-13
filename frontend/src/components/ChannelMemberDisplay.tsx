import Channel from '@/types/Channel';
import { ChannelMemberRole, ChannelMemberStatus } from '@/types/ChannelMembers';
import User from '@/types/User';
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

export interface ChannelMemberDisplayProps {
  id: number;
  role: ChannelMemberRole;
  status: ChannelMemberStatus;
  muted_until: Date;
  channel: Channel;
  user: User;
}

export function ChannelMemberDisplay({
  id,
  role,
  status,
  muted_until,
  channel,
  user,
}: ChannelMemberDisplayProps) {
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''></Avatar>
        </ListItemAvatar>
        <ListItemText primary={user.username} secondary={'Channel ID: ' + id} />
        <ListItemText sx={{ textAlign: 'center' }} secondary={status} />
      </ListItem>
      <Divider />
    </>
  );
}
