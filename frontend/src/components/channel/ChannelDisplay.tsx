import { ChannelType } from '@/types/ChannelTypes';
import {
  AccountCircleRounded,
  AdminPanelSettingsRounded,
  LockPersonRounded,
} from '@mui/icons-material';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from '@mui/material';

export interface ChannelDisplayProps {
  id: number;
  name: string;
  type: ChannelType;
}

export function ChannelDisplay({ id, name, type }: ChannelDisplayProps) {
  return (
    <Paper elevation={2}>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''></Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} secondary={'Channel ID: ' + id} />
        {type === ChannelType.PUBLIC && <AccountCircleRounded />}
        {type === ChannelType.PRIVATE && <AdminPanelSettingsRounded />}
        {type === ChannelType.PROTECTED && <LockPersonRounded />}
      </ListItem>
    </Paper>
  );
}
