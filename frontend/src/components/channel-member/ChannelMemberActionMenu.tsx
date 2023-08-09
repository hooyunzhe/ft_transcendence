'use client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  ChannelMember,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import { IconButton, ListItemIcon, ListItemText } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import RemoveModeratorIcon from '@mui/icons-material/RemoveModerator';
import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import CommentIcon from '@mui/icons-material/Comment';
import SportsMartialArtsIcon from '@mui/icons-material/SportsMartialArts';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import FortIcon from '@mui/icons-material/Fort';
import { useState } from 'react';

interface ChannelMemberActionMenuProps {
  member: ChannelMember;
  currentUserRole: ChannelMemberRole;
  handleAction: (...args: any) => Promise<void>;
}

export default function ChannelMemberActionMenu({
  member,
  currentUserRole,
  handleAction,
}: ChannelMemberActionMenuProps) {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>();

  return (
    <>
      {(member.role != ChannelMemberRole.ADMIN &&
        currentUserRole === ChannelMemberRole.ADMIN) ||
        (currentUserRole === ChannelMemberRole.OWNER && (
          <IconButton
            onClick={(event) => setAnchorElement(event.currentTarget)}
          >
            <ManageAccountsIcon></ManageAccountsIcon>
          </IconButton>
        ))}
      <Menu
        open={anchorElement !== undefined}
        anchorEl={anchorElement}
        onClose={() => setAnchorElement(undefined)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {currentUserRole == ChannelMemberRole.OWNER && (
          <MenuItem
            onClick={() => handleAction(member, ChannelMemberAction.CHOWN)}
          >
            <ListItemIcon>
              <FortIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Pass Channel Ownership</ListItemText>
          </MenuItem>
        )}
        {currentUserRole !== ChannelMemberRole.MEMBER && (
          <MenuItem
            onClick={() => handleAction(member, ChannelMemberAction.BAN)}
          >
            <ListItemIcon>
              <GavelRoundedIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Ban User</ListItemText>
          </MenuItem>
        )}
        {currentUserRole !== ChannelMemberRole.MEMBER && (
          <MenuItem
            onClick={() => {
              handleAction(member, ChannelMemberAction.KICK);
            }}
          >
            <ListItemIcon>
              <SportsMartialArtsIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Kick User</ListItemText>
          </MenuItem>
        )}
        {currentUserRole === ChannelMemberRole.OWNER && (
          <MenuItem
            onClick={() => {
              if (member.role === ChannelMemberRole.MEMBER) {
                handleAction(member, ChannelMemberAction.ADMIN);
              } else {
                handleAction(member, ChannelMemberAction.UNADMIN);
              }
            }}
          >
            <ListItemIcon>
              {member.role === ChannelMemberRole.MEMBER ? (
                <AddModeratorIcon />
              ) : (
                <RemoveModeratorIcon />
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
              if (member.status === ChannelMemberStatus.MUTED) {
                handleAction(member, ChannelMemberAction.UNMUTE);
              } else {
                handleAction(member, ChannelMemberAction.MUTE);
              }
            }}
          >
            <ListItemIcon>
              {member.status === ChannelMemberStatus.MUTED ? (
                <CommentsDisabledIcon />
              ) : (
                <CommentIcon />
              )}
            </ListItemIcon>
            <ListItemText>
              {member.status === ChannelMemberStatus.MUTED
                ? 'Unmute User'
                : 'Mute User'}
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
