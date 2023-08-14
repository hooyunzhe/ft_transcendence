'use client';
import { useState } from 'react';
import { IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { Key, LocalFireDepartmentSharp } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import EditIcon from '@mui/icons-material/Edit';
import BrushIcon from '@mui/icons-material/Brush';
import ChannelNameChangePrompt from './ChannelNameChangePrompt';
import ChannelTypeChangePrompt from './ChannelTypeChangePrompt';
import ChannelPassChangePrompt from './ChannelPassChangePrompt';
import ChannelMemberUnbanPrompt from '../channel-member/ChannelMemberUnbanPrompt';
import ChannelDeletePrompt from './ChannelDeletePrompt';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { ChannelType } from '@/types/ChannelTypes';
import { useChannelMembers } from '@/lib/stores/useChannelMemberStore';
import { ChannelMemberStatus } from '@/types/ChannelMemberTypes';

interface ChannelSettingsProps {
  channelID: number;
  channelName: string;
  channelType: ChannelType;
  channelHash: string;
}

export default function ChannelSettings({
  channelID,
  channelName,
  channelType,
}: ChannelSettingsProps) {
  const channelMembers = useChannelMembers();
  const { displayDialog } = useDialogActions();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>();
  const unbannableMembers = channelMembers.filter(
    (member) =>
      member.channel.id === channelID &&
      member.status === ChannelMemberStatus.BANNED,
  );

  return (
    <>
      <IconButton
        onMouseDown={(event) => event.preventDefault()}
        onClick={(event) => setAnchorElement(event.currentTarget)}
      >
        <SettingsIcon />
      </IconButton>
      <Menu
        open={anchorElement !== undefined}
        anchorEl={anchorElement}
        onClose={() => setAnchorElement(undefined)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem
          onClick={() => {
            displayDialog(
              'Change Channel Name',
              'Please provide the name you want to change to',
              <ChannelNameChangePrompt channelID={channelID} />,
              'Change',
            );
            setAnchorElement(undefined);
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText>Change Channel Name</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            displayDialog(
              'Change Channel Type',
              'Choose the channel type you want.',
              <ChannelTypeChangePrompt
                channelID={channelID}
                channelName={channelName}
                channelType={channelType}
              />,
              'Change',
            );
            setAnchorElement(undefined);
          }}
        >
          <ListItemIcon>
            <BrushIcon />
          </ListItemIcon>
          <ListItemText>Change Channel Type</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            displayDialog(
              'Change Channel Password',
              'Enter the current password to proceed',
              <ChannelPassChangePrompt channelID={channelID} />,
              'Change',
            );
            setAnchorElement(undefined);
          }}
        >
          <ListItemIcon>
            <Key />
          </ListItemIcon>
          <ListItemText>Change Channel Password</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            displayDialog(
              'Unban list',
              unbannableMembers.length
                ? 'Unban the people who have sinned'
                : 'No members to unban, what a clean channel!',
              <ChannelMemberUnbanPrompt
                unbannableMembers={unbannableMembers}
              />,
              'Unban',
            );
            setAnchorElement(undefined);
          }}
        >
          <ListItemIcon>
            <SentimentVeryDissatisfiedIcon />
          </ListItemIcon>
          <ListItemText>Unban List</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            displayDialog(
              'Delete Channel',
              'Enter the channel name to confirm deletion',
              <ChannelDeletePrompt
                channelID={channelID}
                channelName={channelName}
              />,
              'Delete',
            );
            setAnchorElement(undefined);
          }}
        >
          <ListItemIcon>
            <LocalFireDepartmentSharp />
          </ListItemIcon>
          <ListItemText>Delete Channel</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
