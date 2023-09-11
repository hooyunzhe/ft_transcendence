'use client';
import { Box, Button, Typography } from '@mui/material';
import SettingsTwoFactorRemovePrompt from './SettingsTwoFactorRemovePrompt';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useTwoFactorActions } from '@/lib/stores/useTwoFactorStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';

export default function SettingsTwoFactorSegment() {
  const currentUser = useCurrentUser();
  const { displayTwoFactor } = useTwoFactorActions();
  const { displayDialog } = useDialogActions();

  return (
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
          {currentUser.two_factor_enabled ? 'Enabled' : 'Not Enabled'}
        </Typography>
        <Button
          variant='contained'
          color={currentUser.two_factor_enabled ? 'error' : 'success'}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() =>
            displayTwoFactor(
              () =>
                displayDialog(
                  'Remove Two-factor Authentication',
                  'Enter the following phrase to confirm 2fa removal: "Remove two-factor authentication for me"',
                  <SettingsTwoFactorRemovePrompt />,
                  'Remove',
                ),
              !currentUser.two_factor_enabled,
            )
          }
        >
          {currentUser.two_factor_enabled ? 'Remove' : 'Enable'}
        </Button>
      </Box>
    </Box>
  );
}
