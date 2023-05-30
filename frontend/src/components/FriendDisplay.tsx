import { Friend } from '@/types/Friend';
import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { useEffect, useState } from 'react';

export function FriendDisplay({
  id,
  status,
  outgoing_friend,
  incoming_friend,
}: Friend) {
  // const [friendStatus, setFriendStatus] = useState(status);

  // useEffect(() => {
  //   console.log('blahhhh');
  // }, [friendStatus]);
  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar alt=''></Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={incoming_friend.username}
          secondary={'Friend ID: ' + id}
        />
        <ListItemText sx={{ textAlign: 'center' }} secondary={status} />
      </ListItem>
      <Divider />
    </>
  );
}
