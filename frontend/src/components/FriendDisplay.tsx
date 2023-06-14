'use client';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import Friend from '@/types/Friend';
import {
  BlockRounded,
  CancelRounded,
  CheckCircleRounded,
  DeleteRounded,
  RestoreRounded,
} from '@mui/icons-material';

interface FriendDisplayProps {
  category: string;
  friend: Friend;
  status?: string;
  handleAction: (
    request: Friend,
    action: 'accept' | 'reject' | 'remove' | 'block' | 'unblock' | 'delete',
  ) => void;
}

export default function FriendDisplay({
  category,
  friend,
  status,
  handleAction,
}: FriendDisplayProps) {
  return (
    <ListItem sx={{ opacity: status === 'online' ? '100%' : '20%' }}>
      <ListItemAvatar>
        <Avatar alt=''></Avatar>
      </ListItemAvatar>
      <ListItemText primary={friend.incoming_friend.username} />
      {category === 'friends' && (
        <>
          <IconButton
            onClick={() => {
              handleAction(friend, 'block');
            }}
          >
            <BlockRounded />
          </IconButton>
          <IconButton>
            <DeleteRounded
              onClick={() => {
                handleAction(friend, 'delete');
              }}
            />
          </IconButton>
        </>
      )}
      {category === 'pending' && (
        <>
          <IconButton
            onClick={() => {
              handleAction(friend, 'accept');
            }}
          >
            <CheckCircleRounded />
          </IconButton>
          <IconButton
            onClick={() => {
              handleAction(friend, 'reject');
            }}
          >
            <CancelRounded />
          </IconButton>
        </>
      )}
      {category === 'invited' && (
        <IconButton
          onClick={() => {
            handleAction(friend, 'remove');
          }}
        >
          <DeleteRounded />
        </IconButton>
      )}
      {category === 'blocked' && (
        <IconButton
          onClick={() => {
            handleAction(friend, 'unblock');
          }}
        >
          <RestoreRounded />
        </IconButton>
      )}
    </ListItem>
  );
}
