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
import NotificationBar from './NotificationBar';

interface DialogPromptProps {
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

export default function DialogPrompt({
  children,
  buttonText,
  dialogTitle,
  dialogDescription,
  labelText,
  textInput,
  onChangeHandler,
  backButtonText,
  backHandler,
  actionButtonText,
  handleAction,
}: DialogPromptProps) {
  const [open, setOpen] = useState(false);
  const [emptyError, setEmptyError] = useState(false);
  const [actionError, setActionError] = useState(false);
  const [actionErrorMessage, setActionErrorMessage] = useState('');

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
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogDescription}</DialogContentText>
          <TextField
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
            error={emptyError}
            helperText={emptyError ? labelText + ' cannot be empty' : ''}
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
              }
            }}
          >
            {backButtonText}
          </Button>
          <Button
            disabled={!textInput}
            onClick={() => {
              handleAction().then((errorMessage) => {
                if (actionButtonText !== 'Next') {
                  if (errorMessage) {
                    setActionError(true);
                    setActionErrorMessage(errorMessage);
                  } else {
                    setOpen(false);
                  }
                }
              });
            }}
          >
            {actionButtonText}
          </Button>
        </DialogActions>
      </Dialog>
      <NotificationBar
        display={actionError}
        level={'error'}
        message={actionErrorMessage}
        onCloseHandler={() => {
          setActionError(false);
        }}
      ></NotificationBar>
    </>
  );
}
