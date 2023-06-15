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
  backHandler: (...args: any) => Promise<void>;
  actionButtonText: string;
  actionHandler: (...args: any) => Promise<boolean>;
  errorMessage: string;
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
  actionHandler,
  errorMessage,
}: DialogPromptProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [emptyError, setEmptyError] = useState(false);
  const [actionError, setActionError] = useState(false);

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
            id='input'
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
              backHandler(input).then(() => {
                if (backButtonText !== 'Back') {
                  setInput('');
                  setOpen(false);
                }
              });
            }}
          >
            {backButtonText}
          </Button>
          <Button
            disabled={!input}
            onClick={() => {
              setInput('');
              actionHandler(input).then((result) => {
                if (actionButtonText !== 'Next') {
                  if (result) {
                    setOpen(false);
                  } else {
                    setActionError(true);
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
        message={errorMessage}
        onCloseHandler={() => {
          setActionError(false);
        }}
      ></NotificationBar>
    </>
  );
}
