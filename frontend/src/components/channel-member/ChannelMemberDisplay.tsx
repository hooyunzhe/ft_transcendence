'use client';
import { useState } from 'react';
import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { ManageAccounts, Person, Security, Star } from '@mui/icons-material';
import ChannelMemberActionMenu from './ChannelMemberActionMenu';
import {
  useProfileActions,
  useSelectedStatistic,
} from '@/lib/stores/useProfileStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { User, UserStatus } from '@/types/UserTypes';
import {
  ChannelMember,
  ChannelMemberAction,
  ChannelMemberRole,
} from '@/types/ChannelMemberTypes';
import { View } from '@/types/UtilTypes';

interface ChannelMemberDisplayProps {
  user: User;
  status?: UserStatus;
  member?: ChannelMember;
  currentUserRole?: ChannelMemberRole;
  handleAction?: (
    member: ChannelMember,
    action: ChannelMemberAction,
  ) => Promise<void>;
}

export default function ChannelMemberDisplay({
  user,
  status,
  member,
  currentUserRole,
  handleAction,
}: ChannelMemberDisplayProps) {
  const currentView = useCurrentView();
  const selectedStatistic = useSelectedStatistic();
  const { setCurrentView } = useUtilActions();
  const { setSelectedStatistic, resetSelectedStatistic } = useProfileActions();
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | undefined>();

  function handleAvatarClick(): void {
    if (member) {
      if (
        currentView === View.PROFILE &&
        selectedStatistic?.user.id === member.user.id
      ) {
        resetSelectedStatistic();
      } else {
        setSelectedStatistic(member.user.id);
        setCurrentView(View.PROFILE);
      }
    }
  }

  return (
    <ListItem>
      <ListItem
        component='div'
        sx={{
          padding: '0',
          opacity: status === UserStatus.OFFLINE ? '25%' : '100%',
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={user.avatar_url}
            alt={user.username}
            sx={{
              border: 'solid 1px black',
              cursor: 'pointer',
            }}
            onClick={handleAvatarClick}
          />
        </ListItemAvatar>
        <ListItemIcon sx={{ minWidth: '1.5vw' }}>
          {member?.role === ChannelMemberRole.OWNER && <Star />}
          {member?.role === ChannelMemberRole.ADMIN && <Security />}
          {member?.role === ChannelMemberRole.MEMBER && <Person />}
        </ListItemIcon>
        <ListItemText primary={user.username} />
      </ListItem>
      {((member?.role === ChannelMemberRole.MEMBER &&
        currentUserRole === ChannelMemberRole.ADMIN) ||
        (member?.role !== ChannelMemberRole.OWNER &&
          currentUserRole === ChannelMemberRole.OWNER)) && (
        <IconButton
          onMouseDown={(event) => event.preventDefault()}
          onClick={(event) => setMenuAnchor(event.currentTarget)}
        >
          <ManageAccounts />
        </IconButton>
      )}
      {member && currentUserRole && handleAction && (
        <ChannelMemberActionMenu
          anchorElement={menuAnchor}
          member={member}
          currentUserRole={currentUserRole}
          handleAction={handleAction}
          handleClose={() => setMenuAnchor(undefined)}
        />
      )}
    </ListItem>
  );
}
