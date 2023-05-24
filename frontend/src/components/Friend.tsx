import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useEffect, useState } from 'react';

export interface FriendVar {
  id: number;
  intra_uid: string;
  username: string;
  date_of_creation?: string;
  status: string;
}

export function Friend({
  id,
  intra_uid,
  username,
  date_of_creation,
  status,
}: FriendVar) {
  const [friendStatus, setFriendStatus] = useState(status);

  useEffect(() => {
    console.log('blahhhh');
  }, [friendStatus]);
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''></Avatar>
        </ListItemAvatar>
        <ListItemText primary={username} secondary={'Friend ID: ' + id} />
        <ListItemText sx={{ textAlign: 'center' }} secondary={status} />
      </ListItem>
      <Divider />
    </>
  );
}
