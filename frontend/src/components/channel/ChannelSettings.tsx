'use client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import EditIcon from '@mui/icons-material/Edit';
import BrushIcon from '@mui/icons-material/Brush';
import { IconButton, ListItemIcon, ListItemText } from '@mui/material';
import { useState } from 'react';
import ChannelNameChangePrompt from './ChannelNameChangePrompt';
import ChannelTypeChangePrompt from './ChannelTypeChangePrompt';
import { ChannelMemberUnbanPrompt } from '../channel-member/ChannelMemberUnbanPrompt';
import { ChannelType } from '@/types/ChannelTypes';
import ChannelDeletePrompt from './ChannelDeletePrompt';
import ChannelPassChangePrompt from './ChannelPassChangePrompt';
import { Key, LocalFireDepartmentSharp } from '@mui/icons-material';
import { useDialogActions } from '@/lib/stores/useDialogStore';

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
  const { displayDialog } = useDialogActions();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | undefined>();

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
              'Unban the people who have sinned',
              <ChannelMemberUnbanPrompt />,
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
