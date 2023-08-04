'use client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { useNotificationActions } from '@/lib/stores/useNotificationStore';

interface LegacyDialogPromptProps {
  disableText?: boolean;
  altOpen?: boolean;
  resetAltOpen?: () => void;
  children?: ReactNode;
  buttonText: string;
  dialogTitle: string;
  dialogDescription: string;
  labelText: string;
  textInput: string;
  onChangeHandler: (input: string) => void;
  backButtonText: string;
  backHandler: (...args: any) => void;
  actionButtonText: string;
  handleAction: (...args: any) => Promise<string>;
}

export default function LegacyDialogPrompt({
  disableText,
  altOpen,
  resetAltOpen,
  children, // zustand
  buttonText,
  dialogTitle, // zustand
  dialogDescription, // zustand
  labelText,
  textInput,
  onChangeHandler,
  backButtonText, // zustand (optional)
  backHandler, // zustand (optional)
  actionButtonText, // zustand
  handleAction, // zustand
}: LegacyDialogPromptProps) {
  const [open, setOpen] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const { displayNotification } = useNotificationActions();

  return (
    <>
      <Button
        variant='contained'
        onClick={() => {
          setOpen(true);
        }}
      >
        {buttonText}
      </Button>
      <Dialog
        open={open || (altOpen ?? false)}
        onClose={() => {
          setOpen(false);
          resetAltOpen && resetAltOpen();
        }}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogDescription}</DialogContentText>
          <TextField
            disabled={disableText}
            autoComplete='off'
            autoFocus
            fullWidth
            margin='dense'
            variant='standard'
            id='textInput'
            label={labelText}
            value={textInput}
            onChange={(e) => {
              setEmptyError(!e.target.value);
              onChangeHandler(e.target.value);
            }}
            error={disableText ? false : emptyError}
            helperText={
              !disableText && emptyError ? labelText + ' cannot be empty' : ''
            }
          ></TextField>
          {children}
        </DialogContent>
        <DialogActions>
          <Button
            size='large'
            onClick={() => {
              backHandler();
              if (backButtonText !== 'Back') {
                setOpen(false);
                resetAltOpen && resetAltOpen();
              }
            }}
          >
            {backButtonText}
          </Button>
          <Button
            disabled={disableText ? false : !textInput}
            onClick={() => {
              handleAction().then((errorMessage) => {
                if (errorMessage) {
                  displayNotification('error', errorMessage);
                } else if (actionButtonText !== 'Next') {
                  setOpen(false);
                  resetAltOpen && resetAltOpen();
                }
              });
            }}
          >
            {actionButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
