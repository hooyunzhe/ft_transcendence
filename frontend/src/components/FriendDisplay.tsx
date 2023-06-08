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
    action: 'accept' | 'reject' | 'block' | 'unblock' | 'delete',
  ) => void;
}

export default function FriendDisplay({
  category,
  friend,
  status,
  handleAction,
}: FriendDisplayProps) {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt=''></Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          friend.incoming_friend.username +
          ' (' +
          friend.incoming_friend.id +
          ')'
        }
      />
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
            handleAction(friend, 'delete');
          }}
        >
          <DeleteRounded />
        </IconButton>
      )}
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
