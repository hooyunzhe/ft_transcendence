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
import {
  useProfileActions,
  useSelectedStatistic,
} from '@/lib/stores/useProfileStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { Friend, FriendAction, FriendStatus } from '@/types/FriendTypes';
import { UserStatus } from '@/types/UserTypes';
import { FriendCategory, View } from '@/types/UtilTypes';

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
  const currentView = useCurrentView();
  const selectedStatistic = useSelectedStatistic();
  const { setCurrentView } = useUtilActions();
  const { setSelectedStatistic, resetSelectedStatistic } = useProfileActions();

  function handleAvatarClick(): void {
    if (
      currentView === View.PROFILE &&
      selectedStatistic?.user.id === friend.incoming_friend.id
    ) {
      resetSelectedStatistic();
    } else {
      setSelectedStatistic(friend.incoming_friend.id);
      setCurrentView(View.PROFILE);
    }
  }

  return (
    <ListItem
      sx={{
        border: 'solid 3px #a23833',
        borderRadius: '10px',
        // bgcolor: '#A4B5C6',
        background:
          status === UserStatus.IN_GAME
            ? 'linear-gradient(90deg, #e85149, #363bd6)'
            : '#A4B5C6',
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
            alt={friend.incoming_friend.username}
            sx={{
              border: 'solid 1px black',
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (friend.status !== FriendStatus.BLOCKED) {
                handleAvatarClick();
              }
            }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={friend.incoming_friend.username}
          sx={{
            wordBreak: 'break-all',
          }}
        />
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
