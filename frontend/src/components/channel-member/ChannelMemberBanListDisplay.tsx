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
      <ListItemButton selected={selected === member.id} onClick={selectCurrent}>
        <ListItem>
          <ListItemAvatar>
            <Avatar alt='' src={member.user.avatar_url} />
          </ListItemAvatar>
          <ListItemText primary={member.user.username} />
        </ListItem>
      </ListItemButton>
    </Paper>
  );
}
