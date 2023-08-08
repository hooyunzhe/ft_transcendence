'use client';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Friend, FriendAction } from '@/types/FriendTypes';
import {
  BlockRounded,
  CancelRounded,
  CheckCircleRounded,
  DeleteRounded,
  RestoreRounded,
} from '@mui/icons-material';
import { UserStatus } from '@/types/UserTypes';

interface FriendDisplayProps {
  category: string;
  friend: Friend;
  status?: string;
  handleAction: (request: Friend, action: FriendAction) => void;
}

export default function FriendDisplay({
  category,
  friend,
  status,
  handleAction,
}: FriendDisplayProps) {
  return (
    <ListItem
      sx={{
        ...(category === 'friends' && {
          opacity: status === UserStatus.ONLINE ? '100%' : '20%',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar src={friend.incoming_friend.avatar_url} />
      </ListItemAvatar>
      <ListItemText primary={friend.incoming_friend.username} />
      {category === 'friends' && (
        <>
          <IconButton
            onClick={() => {
              handleAction(friend, FriendAction.BLOCK);
            }}
          >
            <BlockRounded />
          </IconButton>
          <IconButton
            onClick={() => {
              handleAction(friend, FriendAction.UNFRIEND);
            }}
          >
            <DeleteRounded />
          </IconButton>
        </>
      )}
      {category === 'pending' && (
        <>
          <IconButton
            onClick={() => {
              handleAction(friend, FriendAction.ACCEPT);
            }}
          >
            <CheckCircleRounded />
          </IconButton>
          <IconButton
            onClick={() => {
              handleAction(friend, FriendAction.REJECT);
            }}
          >
            <CancelRounded />
          </IconButton>
        </>
      )}
      {category === 'invited' && (
        <IconButton
          onClick={() => {
            handleAction(friend, FriendAction.REMOVE);
          }}
        >
          <DeleteRounded />
        </IconButton>
      )}
      {category === 'blocked' && (
        <IconButton
          onClick={() => {
            handleAction(friend, FriendAction.UNBLOCK);
          }}
        >
          <RestoreRounded />
        </IconButton>
      )}
    </ListItem>
  );
}
