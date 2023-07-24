'use client';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import { ChannelMembers } from '@/types/ChannelMemberTypes';

interface BanListDisplayProps {
  member: ChannelMembers;
  selected: number;
  selectCurrent: () => void;
  status?: string;
}

export default function BanListDisplay({
  selected,
  selectCurrent,
  member,
}: BanListDisplayProps) {
  return (
    <Paper elevation={2}>
      <ListItemButton
        selected={selected === member.user.id}
        onClick={selectCurrent}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar alt=''></Avatar>
          </ListItemAvatar>
          <ListItemText primary={member.user.username} />
        </ListItem>
      </ListItemButton>
    </Paper>
  );
}
