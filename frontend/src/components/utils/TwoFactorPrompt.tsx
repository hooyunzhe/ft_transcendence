'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
} from '@mui/material';
import callAPI from '@/lib/callAPI';
import {
  useTwoFactor,
  useTwoFactorActions,
} from '@/lib/stores/useTwoFactorStore';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useDialogActions } from '@/lib/stores/useDialogStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

export default function TwoFactorPrompt() {
  const twoFactor = useTwoFactor();
  const currentUser = useCurrentUser();
  const { resetTwoFactor } = useTwoFactorActions();
  const { displayDialog } = useDialogActions();
  const { displayNotification } = useNotificationActions();
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  async function verifyCode(lastDigit: string): Promise<void> {
    callAPI('POST', 'two-factor/verify', {
      user_id: currentUser.id,
      token: twoFactorCode + lastDigit,
    }).then((res) => {
      const result = JSON.parse(res);

      if (result.verified) {
        resetTwoFactor();
        setTwoFactorCode('');
        displayDialog(
          twoFactor.title,
          twoFactor.description,
          twoFactor.children,
          twoFactor.actionButtonText,
        );
      } else {
        displayNotification('error', 'Invalid Code');
      }
    });
  }

  function handleKeyDown(index: number, key: string): void {
    if (/^[0-9]$/.test(key)) {
      setTwoFactorCode(
        (twoFactorCode) =>
          twoFactorCode.slice(0, index) + key + twoFactorCode.slice(index + 1),
      );
      inputRefs.current[index + 1]?.focus();
      if (twoFactorCode.length === 5) {
        verifyCode(key);
      }
    }
    if (key === 'Backspace') {
      const offset = twoFactorCode.length === 6 ? 0 : 1;

      setTwoFactorCode((twoFactorCode) =>
        twoFactorCode.slice(0, index - offset),
      );
      inputRefs.current[index - offset]?.focus();
    }
  }

  useEffect(() => {
    if (twoFactor.display && !currentUser.two_factor_enabled) {
      resetTwoFactor();
      displayDialog(
        twoFactor.title,
        twoFactor.description,
        twoFactor.children,
        twoFactor.actionButtonText,
      );
    }
  }, [twoFactor.display]);

  return (
    <Dialog
      open={twoFactor.display}
      onClose={() => {
        resetTwoFactor();
        setTwoFactorCode('');
      }}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle>Two Factor Authentication</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the 6 digit code from your authenticator app
        </DialogContentText>
        <Box
          width='100%'
          margin='2vh 0'
          display='flex'
          justifyContent='space-between'
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <OutlinedInput
              key={index}
              autoFocus={index === 0}
              inputRef={(element) => {
                inputRefs.current[index] = element;
              }}
              autoComplete='off'
              value={twoFactorCode[index] ?? ''}
              onKeyDown={(event) => handleKeyDown(index, event.key)}
              sx={{ width: '55px', height: '55px' }}
              inputProps={{
                sx: {
                  padding: '10px',
                  fontSize: '30px',
                  textAlign: 'center',
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
