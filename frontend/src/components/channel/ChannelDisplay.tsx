'use client';
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
import ChannelSettings from './ChannelSettings';

export interface ChannelDisplayProps {
  id: number;
  name: string;
  type: ChannelType;
  selected: boolean;
  selectCurrent: () => void;
  isOwner: boolean;
}

export function ChannelDisplay({
  id,
  name,
  type,
  selected,
  selectCurrent,
  isOwner,
}: ChannelDisplayProps) {
  return (
    <Paper elevation={2}>
      <ListItemButton selected={selected} onClick={selectCurrent}>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt=''></Avatar>
          </ListItemAvatar>
          <ListItemText primary={name} secondary={'Channel ID: ' + id} />
          {type === ChannelType.PUBLIC && <AccountCircleRounded />}
          {type === ChannelType.PRIVATE && <AdminPanelSettingsRounded />}
          {type === ChannelType.PROTECTED && <LockPersonRounded />}
          {isOwner && <ChannelSettings channelID={id} channelType={type} />}
        </ListItem>
      </ListItemButton>
    </Paper>
  );
}
