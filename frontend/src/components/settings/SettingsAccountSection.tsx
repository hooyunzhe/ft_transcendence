'use client';
import { signOut } from 'next-auth/react';
import { Avatar, Box, Button, Switch, Typography } from '@mui/material';
import SettingsUsernameChangePrompt from './SettingsUsernameChangePrompt';
import SettingsTwoFactorRemovePrompt from './SettingsTwoFactorRemovePrompt';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useTwoFactorActions } from '@/lib/stores/useTwoFactorStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';

export default function SettingsAccountSection() {
  const currentUser = useCurrentUser();
  const { setupTwoFactor, displayTwoFactor } = useTwoFactorActions();
  const { displayDialog } = useDialogActions();

  return (
    <Box
      alignSelf='center'
      width='50%'
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
      alignItems='center'
      padding='1.5vw'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      <Avatar
        src={currentUser.avatar_url}
        sx={{
          width: '125px',
          height: '125px',
          border: 'solid 1px black',
        }}
      />
      <Box width='100%'>
        <Typography>Username</Typography>
        <Box
          width='100%'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography variant='h5'>{currentUser.username}</Typography>
          <Button
            variant='contained'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              displayTwoFactor(() =>
                displayDialog(
                  'Change Username',
                  'Enter your new username',
                  <SettingsUsernameChangePrompt />,
                  'Change',
                ),
              )
            }
          >
            Change
          </Button>
        </Box>
      </Box>
      <Box width='100%'>
        <Typography>Two-factor Authentication</Typography>
        <Box
          width='100%'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Typography
            variant='h5'
            color={currentUser.two_factor_enabled ? 'chartreuse' : 'firebrick'}
          >
            {currentUser.two_factor_enabled ? '' : 'Not'} Enabled
          </Typography>
          <Button
            variant='contained'
            color={currentUser.two_factor_enabled ? 'error' : 'success'}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              if (currentUser.two_factor_enabled) {
                displayTwoFactor(() => {
                  displayDialog(
                    'Remove Two-factor Authentication',
                    'Enter the following phrase to confirm removal: "Remove two-factor authentication for me"',
                    <SettingsTwoFactorRemovePrompt />,
                    'Remove',
                  );
                });
              } else {
                setupTwoFactor();
              }
            }}
          >
            {currentUser.two_factor_enabled ? 'Remove' : 'Enable'}
          </Button>
        </Box>
      </Box>
      <Box width='100%' display='flex' justifyContent='space-between'>
        <Box>
          <Typography variant='h6'>Music</Typography>
          <Switch defaultChecked />
        </Box>
        <Box>
          <Typography variant='h6'>Animations</Typography>
          <Switch defaultChecked />
        </Box>
        <Box>
          <Typography variant='h6'>Light Mode</Typography>
          <Switch />
        </Box>
      </Box>
      <Box
        width='50%'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        gap='1vh'
      >
        <Button variant='contained' color='warning' onClick={() => signOut()}>
          Log out
        </Button>
        <Button variant='contained' color='error'>
          Delete Account
        </Button>
      </Box>
    </Box>
  );
}
