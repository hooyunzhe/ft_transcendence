import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

export interface ChannelDisplayProps {
  id: number;
  name: string;
  type: string;
}

export function ChannelDisplay({ id, name, type }: ChannelDisplayProps) {
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''></Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} secondary={'Channel ID: ' + id} />
        <ListItemText sx={{ textAlign: 'center' }} secondary={type} />
      </ListItem>
      <Divider />
    </>
  );
}
