'use client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  ChannelMembers,
  ChannelMemberAction,
  ChannelMemberRole,
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuList,
} from '@mui/material';
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
  member: ChannelMembers;
  currentUserRole: ChannelMemberRole;
  handleAction: (...args: any) => Promise<void>;
}

export default function ChannelMemberActionMenu({
  member,
  currentUserRole,
  handleAction,
}: ChannelMemberActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {(member.role != ChannelMemberRole.ADMIN &&
        currentUserRole === ChannelMemberRole.ADMIN) ||
      currentUserRole === ChannelMemberRole.OWNER ? (
        <IconButton
          id='demo-positioned-button'
          aria-controls={open ? 'demo-positioned-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <ManageAccountsIcon></ManageAccountsIcon>
        </IconButton>
      ) : null}
      <Menu
        id='demo-positioned-menu'
        aria-labelledby='demo-positioned-button'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuList>
          {currentUserRole == ChannelMemberRole.OWNER ? (
            <MenuItem
              onClick={() => handleAction(member, ChannelMemberAction.CHOWN)}
            >
              <ListItemIcon>
                <FortIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Pass Channel Ownership</ListItemText>
            </MenuItem>
          ) : null}

          {currentUserRole !== ChannelMemberRole.MEMBER ? (
            <MenuItem
              onClick={() => handleAction(member, ChannelMemberAction.BAN)}
            >
              <ListItemIcon>
                <GavelRoundedIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>Ban User</ListItemText>
            </MenuItem>
          ) : null}

          {currentUserRole !== ChannelMemberRole.MEMBER ? (
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
          ) : null}

          {currentUserRole === ChannelMemberRole.OWNER ? (
            <MenuItem
              onClick={() => {
                if (member.role === ChannelMemberRole.MEMBER) {
                  handleAction(member, ChannelMemberAction.ADMIN);
                } else {
                  handleAction(member, ChannelMemberAction.UNADMIN);
                }
              }}
            >
              <>
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
              </>
            </MenuItem>
          ) : null}

          {currentUserRole !== ChannelMemberRole.MEMBER ? (
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
          ) : null}
        </MenuList>
      </Menu>
    </div>
  );
}
