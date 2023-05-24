import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

export interface ChannelVar {
  id: number;
  name: string;
  type: string;
}

export function Channel({ id, name, type }: ChannelVar) {
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
