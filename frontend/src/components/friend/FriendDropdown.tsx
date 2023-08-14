'use client';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  MoveToInboxRounded,
  OutboxRounded,
  PeopleRounded,
  PersonOff,
} from '@mui/icons-material';
import FriendList from './FriendList';
import {
  useCurrentFriendCategory,
  useUtilActions,
} from '@/lib/stores/useUtilStore';
import { Friend, FriendAction } from '@/types/FriendTypes';
import { FriendCategory } from '@/types/UtilTypes';

interface FriendDropdownProps {
  category: FriendCategory;
  handleAction: (request: Friend, action: FriendAction) => void;
}

export default function FriendDropdown({
  category,
  handleAction,
}: FriendDropdownProps) {
  const currentFriendCategory = useCurrentFriendCategory();
  const { setCurrentFriendCategory } = useUtilActions();

  return (
    <>
      <Paper elevation={2}>
        <ListItemButton
          onClick={() =>
            setCurrentFriendCategory(
              currentFriendCategory === category ? undefined : category,
            )
          }
        >
          <ListItemIcon>
            {category === FriendCategory.FRIENDS && <PeopleRounded />}
            {category === FriendCategory.PENDING && <MoveToInboxRounded />}
            {category === FriendCategory.INVITED && <OutboxRounded />}
            {category === FriendCategory.BLOCKED && <PersonOff />}
          </ListItemIcon>
          <ListItemText
            primary={category.charAt(0) + category.toLowerCase().slice(1)}
          ></ListItemText>
          {currentFriendCategory === category ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </Paper>
      <FriendList
        expand={currentFriendCategory === category}
        category={category}
        handleAction={handleAction}
      />
    </>
  );
}
