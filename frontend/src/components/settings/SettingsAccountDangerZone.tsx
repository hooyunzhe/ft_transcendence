'use client';
import { signOut } from 'next-auth/react';
import { Box, Button } from '@mui/material';
import SettingsAccountDeletePrompt from './SettingsAccountDeletePrompt';
import { useTwoFactorActions } from '@/lib/stores/useTwoFactorStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';

export default function SettingsAccountDangerZone() {
  const { displayTwoFactor } = useTwoFactorActions();
  const { displayDialog } = useDialogActions();

  return (
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
      <Button
        variant='contained'
        color='error'
        onMouseDown={(event) => event.preventDefault()}
        onClick={() =>
          displayTwoFactor(() =>
            displayDialog(
              'Delete Account',
              'Enter the following phrase to confirm account deletion: "Delete my account for me"',
              <SettingsAccountDeletePrompt />,
              'Delete',
            ),
          )
        }
      >
        Delete Account
      </Button>
    </Box>
  );
}
