'use client';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import {
  BlockRounded,
  CancelRounded,
  CheckCircleRounded,
  DeleteRounded,
  RestoreRounded,
} from '@mui/icons-material';
import { Friend, FriendAction } from '@/types/FriendTypes';
import { UserStatus } from '@/types/UserTypes';
import { FriendCategory } from '@/types/UtilTypes';

interface FriendDisplayProps {
  category: FriendCategory;
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
        border: 'solid 3px #a23833',
        borderRadius: '10px',
        bgcolor: '#A4B5C6',
      }}
    >
      <ListItem
        component='div'
        sx={{
          opacity:
            category === FriendCategory.FRIENDS && status === UserStatus.OFFLINE
              ? '25%'
              : '100%',
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={friend.incoming_friend.avatar_url}
            sx={{
              border: 'solid 1px black',
            }}
          />
        </ListItemAvatar>
        <ListItemText primary={friend.incoming_friend.username} />
      </ListItem>
      {category === FriendCategory.FRIENDS && (
        <>
          <IconButton
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation();
              handleAction(friend, FriendAction.BLOCK);
            }}
          >
            <BlockRounded />
          </IconButton>
          <IconButton
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation();
              handleAction(friend, FriendAction.UNFRIEND);
            }}
          >
            <DeleteRounded />
          </IconButton>
        </>
      )}
      {category === FriendCategory.PENDING && (
        <>
          <IconButton
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation();
              handleAction(friend, FriendAction.ACCEPT);
            }}
          >
            <CheckCircleRounded />
          </IconButton>
          <IconButton
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation();
              handleAction(friend, FriendAction.REJECT);
            }}
          >
            <CancelRounded />
          </IconButton>
        </>
      )}
      {category === FriendCategory.INVITED && (
        <IconButton
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            handleAction(friend, FriendAction.REMOVE);
          }}
        >
          <DeleteRounded />
        </IconButton>
      )}
      {category === FriendCategory.BLOCKED && (
        <IconButton
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.stopPropagation();
            handleAction(friend, FriendAction.UNBLOCK);
          }}
        >
          <RestoreRounded />
        </IconButton>
      )}
    </ListItem>
  );
}
