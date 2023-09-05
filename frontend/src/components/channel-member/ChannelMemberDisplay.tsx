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
import { User } from '@/types/UserTypes';
import {
  ChannelMember,
  ChannelMemberAction,
  ChannelMemberRole,
} from '@/types/ChannelMemberTypes';

interface ChannelMemberDisplayProps {
  user: User;
  member?: ChannelMember;
  currentUserRole?: ChannelMemberRole;
  handleAction?: (
    member: ChannelMember,
    action: ChannelMemberAction,
  ) => Promise<void>;
}

export default function ChannelMemberDisplay({
  user,
  member,
  currentUserRole,
  handleAction,
}: ChannelMemberDisplayProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | undefined>();

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          src={user.avatar_url}
          sx={{
            border: 'solid 1px black',
          }}
        />
      </ListItemAvatar>
      <ListItemIcon sx={{ minWidth: '1.5vw' }}>
        {member?.role === ChannelMemberRole.OWNER && <Star />}
        {member?.role === ChannelMemberRole.ADMIN && <Security />}
        {member?.role === ChannelMemberRole.MEMBER && <Person />}
      </ListItemIcon>
      <ListItemText primary={user.username} />
      {(member?.role === ChannelMemberRole.MEMBER &&
        currentUserRole === ChannelMemberRole.ADMIN) ||
        (member?.role !== ChannelMemberRole.OWNER &&
          currentUserRole === ChannelMemberRole.OWNER && (
            <IconButton onClick={(event) => setMenuAnchor(event.currentTarget)}>
              <ManageAccounts />
            </IconButton>
          ))}
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
