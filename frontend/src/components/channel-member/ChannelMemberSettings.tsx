import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuList,
  Paper,
  Stack,
} from '@mui/material';
import DialogPrompt from '../utils/DialogPrompt';
import { useState } from 'react';
import { ChannelMemberDisplay } from './ChannelMemberDisplay';
import ChannelMembers, {
  ChannelMemberStatus,
} from '@/types/ChannelMemberTypes';

interface ChannelMemberSettingsProps {
  channelMember: ChannelMembers[];
  // handleAction: (...args: any) => Promise<void>;
  handleDisplayAction: (...args: any) => Promise<void>;
}

export default function ChannelMemberSettings({
  channelMember,
  // handleAction,
  handleDisplayAction,
}: ChannelMemberSettingsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedMember, setSelectedMember] = useState<
    ChannelMembers | undefined
  >();
  const [memberSearch, setMemberSearch] = useState('');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log('--PRINTING CHANNEL MEMBER---');
  console.log(channelMember);

  async function handleUnbanMemberAction(): Promise<string> {
    if (selectedMember === undefined) {
      return "Banned user doesn't exist";
    }
    const UserToUnban = channelMember.find(
      (member) => member.id === selectedMember.id,
    );

    if (!UserToUnban) {
      return 'Invalid friend name!';
    }
    return addUser(UserToUnban.id);
  }

  return (
    <div>
      <IconButton
        id='demo-positioned-button'
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <SettingsIcon></SettingsIcon>
      </IconButton>
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
        <Paper sx={{ width: 320, maxWidth: '100%' }}>
          <MenuList>
            <MenuItem
              onClick={() => (
                <DialogPrompt
                  buttonText='Unban'
                  dialogTitle='Add members'
                  dialogDescription='Add your friends to the channel'
                  labelText='username'
                  textInput={memberSearch}
                  backButtonText='Cancel'
                  onChangeHandler={(input) => {
                    setMemberSearch(input);
                    setSelectedMember(undefined);
                  }}
                  backHandler={async () => {}}
                  actionButtonText='Unban'
                  handleAction={async () => {
                    const response = await handleAddMemberAction();

                    console.log('response: ' + response);
                    if (!response) {
                      setMemberSearch('');
                      setSelectedMember(undefined);
                    }
                    return response;
                  }}
                >
                  <Stack
                    maxHeight={200}
                    overflow='auto'
                    spacing={1}
                    sx={{ p: 1 }}
                  >
                    {channelMember
                      .filter((friend) =>
                        channelMember.every((member) => {
                          return member.status === ChannelMemberStatus.BANNED;
                        }),
                      )
                      .map((channelMember: ChannelMembers, index: number) => (
                        <>
                          <ChannelMemberDisplay
                            key={index}
                            channelMember={channelMember}
                            handleAction={handleDisplayAction}
                          />
                        </>
                      ))}
                  </Stack>
                </DialogPrompt>
              )}
            >
              <ListItemIcon>
                <SentimentVeryDissatisfiedIcon />
              </ListItemIcon>
              <ListItemText>Channel Ban List</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </div>
  );
}
