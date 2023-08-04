'use client';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import EditIcon from '@mui/icons-material/Edit';
import BrushIcon from '@mui/icons-material/Brush';
import {
  Button,
  IconButton,
  ListItemIcon,
  MenuList,
  Paper,
} from '@mui/material';
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
  const [open, setOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  function handleClick(event: React.MouseEvent<HTMLElement>): void {
    event.stopPropagation();
    setAnchorElement(event.currentTarget);
    setOpen(true);
  }
  function handleClose(): void {
    setAnchorElement(null);
    setOpen(false);
  }

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        onClick={(event) => {
          event.stopPropagation();
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <MenuList>
            <MenuItem>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <Button
                onClick={() =>
                  displayDialog(
                    'Change Channel Name',
                    'Please provide the name you want to change to',
                    <ChannelNameChangePrompt channelID={channelID} />,
                    'Change',
                  )
                }
              >
                Change Channel Name
              </Button>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <BrushIcon />
              </ListItemIcon>
              <Button
                onClick={() =>
                  displayDialog(
                    'Change Channel Type',
                    'Choose the channel type you want.',
                    <ChannelTypeChangePrompt
                      channelID={channelID}
                      channelType={channelType}
                    />,
                    'Change',
                  )
                }
              >
                Change Channel Type
              </Button>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Key />
              </ListItemIcon>
              <Button
                onClick={() =>
                  displayDialog(
                    'Change Channel Password',
                    'Enter the current password to proceed',
                    <ChannelPassChangePrompt channelID={channelID} />,
                    'Change',
                  )
                }
              >
                Change Channel Password
              </Button>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <SentimentVeryDissatisfiedIcon />
              </ListItemIcon>
              <Button
                onClick={() =>
                  displayDialog(
                    'Unban list',
                    'Unban the people who have sinned',
                    <ChannelMemberUnbanPrompt />,
                    'Unban',
                  )
                }
              >
                Unban List
              </Button>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <LocalFireDepartmentSharp />
              </ListItemIcon>
              <Button
                onClick={() =>
                  displayDialog(
                    'Delete Channel',
                    'Enter the channel name to confirm deletion',
                    <ChannelDeletePrompt
                      channelID={channelID}
                      channelName={channelName}
                    />,
                    'Delete',
                  )
                }
              >
                Delete Channel
              </Button>
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </div>
  );
}
