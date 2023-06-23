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
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';

export interface ChannelDisplayProps {
  id: number;
  name: string;
  type: ChannelType;
  selected: number;
  selectCurrent: () => void;
}

export function ChannelDisplay({
  id,
  name,
  type,
  selected,
  selectCurrent,
}: ChannelDisplayProps) {
  return (
    <Paper elevation={2}>
      <ListItemButton selected={selected === id} onClick={selectCurrent}>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt=''></Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} secondary={'Channel ID: ' + id} />
          {type === ChannelType.PUBLIC && <AccountCircleRounded />}
          {type === ChannelType.PRIVATE && <AdminPanelSettingsRounded />}
          {type === ChannelType.PROTECTED && <LockPersonRounded />}
        </ListItem>
      </ListItemButton>
    </Paper>
  );
}
