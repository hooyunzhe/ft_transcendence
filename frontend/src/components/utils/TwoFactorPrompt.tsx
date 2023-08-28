'use client';
import { toDataURL } from 'qrcode';
import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
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
import { useCurrentUser, useUserActions } from '@/lib/stores/useUserStore';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

export default function TwoFactorPrompt() {
  const twoFactor = useTwoFactor();
  const currentUser = useCurrentUser();
  const { setCurrentUserTwoFactorEnabled } = useUserActions();
  const { resetTwoFactor } = useTwoFactorActions();
  const { displayNotification } = useNotificationActions();
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorUrl, setTwoFactorUrl] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  async function getTwoFactor(): Promise<void> {
    callAPI('POST', 'two-factor', {
      user_id: currentUser.id,
    }).then((res) => {
      const newTwoFactor = JSON.parse(res);

      setTwoFactorSecret(newTwoFactor.secretKey);
      toDataURL(newTwoFactor.otpAuthUrl, (error, imageUrl) => {
        if (error) {
          console.log('Error with QR');
          return;
        }
        setTwoFactorUrl(imageUrl);
      });
    });
  }

  async function setupTwoFactor(lastDigit: string): Promise<void> {
    callAPI('POST', 'two-factor/setup', {
      user_id: currentUser.id,
      secret_key: twoFactorSecret,
      token: twoFactorCode + lastDigit,
    }).then((res) => {
      const result = JSON.parse(res);

      if (result.statusCode === 403) {
        displayNotification('error', 'Invalid code');
      } else {
        resetTwoFactor();
        setTwoFactorCode('');
        setCurrentUserTwoFactorEnabled(true);
        displayNotification('success', 'Two-factor authentication enabled!');
      }
    });
  }

  async function verifyCode(lastDigit: string): Promise<void> {
    callAPI('POST', 'two-factor/verify', {
      user_id: currentUser.id,
      token: twoFactorCode + lastDigit,
    }).then((res) => {
      const result = JSON.parse(res);

      if (result.verified) {
        resetTwoFactor();
        setTwoFactorCode('');
        twoFactor.handleAction();
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
      inputRefs.current[
        index === twoFactorCode.length
          ? twoFactorCode.length + 1
          : twoFactorCode.length
      ]?.focus();
      if (index === twoFactorCode.length && twoFactorCode.length === 5) {
        if (twoFactor.setup) {
          setupTwoFactor(key);
        } else {
          verifyCode(key);
        }
      }
    }
    if (key === 'Backspace') {
      setTwoFactorCode((twoFactorCode) => twoFactorCode.slice(0, -1));
      inputRefs.current[twoFactorCode.length - 1]?.focus();
    }
  }

  useEffect(() => {
    if (twoFactor.display) {
      if (twoFactor.setup) {
        getTwoFactor();
      } else if (!currentUser.two_factor_enabled) {
        resetTwoFactor();
        twoFactor.handleAction();
      }
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
      <DialogTitle>
        {twoFactor.setup ? 'Setup' : ''} Two-factor Authentication
      </DialogTitle>
      <DialogContent>
        {twoFactor.setup ? (
          <Box>
            <DialogContentText>
              1. Download an authenticator app
            </DialogContentText>
            <DialogContentText variant='body2'>
              (Google Authenticator/Authy)
            </DialogContentText>
            <DialogContentText>2. Scan the QR code</DialogContentText>
            <DialogContentText>
              3. Enter the 6 digit code from the authenticator app
            </DialogContentText>
            <Avatar
              variant='square'
              src={twoFactorUrl}
              sx={{ width: '100%', height: '100%' }}
            />
          </Box>
        ) : (
          <DialogContentText>
            Enter the 6 digit code from your authenticator app
          </DialogContentText>
        )}
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
