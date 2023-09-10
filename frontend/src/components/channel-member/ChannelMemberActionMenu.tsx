'use client';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import {
  AddModerator,
  Comment,
  CommentsDisabled,
  Fort,
  GavelRounded,
  RemoveModerator,
  SportsMartialArts,
} from '@mui/icons-material';
import {
  ChannelMember,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';

interface ChannelMemberActionMenuProps {
  anchorElement: HTMLButtonElement | undefined;
  member: ChannelMember;
  currentUserRole: ChannelMemberRole;
  handleAction: (
    member: ChannelMember,
    action: ChannelMemberAction,
  ) => Promise<void>;
  handleClose: () => void;
}

export default function ChannelMemberActionMenu({
  anchorElement,
  member,
  currentUserRole,
  handleAction,
  handleClose,
}: ChannelMemberActionMenuProps) {
  return (
    <Menu
      open={anchorElement !== undefined}
      anchorEl={anchorElement}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {currentUserRole == ChannelMemberRole.OWNER && (
        <MenuItem
          onClick={() => {
            handleClose();
            handleAction(member, ChannelMemberAction.CHOWN);
          }}
        >
          <ListItemIcon>
            <Fort fontSize='small' />
          </ListItemIcon>
          <ListItemText>Pass Channel Ownership</ListItemText>
        </MenuItem>
      )}
      {currentUserRole === ChannelMemberRole.OWNER && (
        <MenuItem
          onClick={() => {
            handleClose();
            if (member.role === ChannelMemberRole.MEMBER) {
              handleAction(member, ChannelMemberAction.ADMIN);
            } else {
              handleAction(member, ChannelMemberAction.UNADMIN);
            }
          }}
        >
          <ListItemIcon>
            {member.role === ChannelMemberRole.MEMBER ? (
              <AddModerator />
            ) : (
              <RemoveModerator />
            )}
          </ListItemIcon>
          <ListItemText>
            {member.role === ChannelMemberRole.MEMBER
              ? 'Promote to Admin'
              : 'Demote to Member'}
          </ListItemText>
        </MenuItem>
      )}
      {currentUserRole !== ChannelMemberRole.MEMBER && (
        <MenuItem
          onClick={() => {
            handleClose();
            handleAction(member, ChannelMemberAction.BAN);
          }}
        >
          <ListItemIcon>
            <GavelRounded fontSize='small' />
          </ListItemIcon>
          <ListItemText>Ban User</ListItemText>
        </MenuItem>
      )}
      {currentUserRole !== ChannelMemberRole.MEMBER && (
        <MenuItem
          onClick={() => {
            handleClose();
            handleAction(member, ChannelMemberAction.KICK);
          }}
        >
          <ListItemIcon>
            <SportsMartialArts fontSize='small' />
          </ListItemIcon>
          <ListItemText>Kick User</ListItemText>
        </MenuItem>
      )}
      {currentUserRole !== ChannelMemberRole.MEMBER && (
        <MenuItem
          onClick={() => {
            handleClose();
            if (
              member.status === ChannelMemberStatus.MUTED &&
              new Date(member.muted_until).getTime() > Date.now()
            ) {
              handleAction(member, ChannelMemberAction.UNMUTE);
            } else {
              handleAction(member, ChannelMemberAction.MUTE);
            }
          }}
        >
          <ListItemIcon>
            {member.status === ChannelMemberStatus.MUTED &&
            new Date(member.muted_until).getTime() > Date.now() ? (
              <CommentsDisabled />
            ) : (
              <Comment />
            )}
          </ListItemIcon>
          <ListItemText>
            {member.status === ChannelMemberStatus.MUTED &&
            new Date(member.muted_until).getTime() > Date.now()
              ? 'Unmute User'
              : 'Mute User'}
          </ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
}
