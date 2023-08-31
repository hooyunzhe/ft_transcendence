'use client';
import { Box, Button, Typography } from '@mui/material';
import SettingsUsernameChangePrompt from './SettingsUsernameChangePrompt';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useTwoFactorActions } from '@/lib/stores/useTwoFactorStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';

export default function SettingsUsernameSegment() {
  const currentUser = useCurrentUser();
  const { displayTwoFactor } = useTwoFactorActions();
  const { displayDialog } = useDialogActions();

  return (
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
  );
}
