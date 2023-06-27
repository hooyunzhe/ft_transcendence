import {
  Alert,
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import { ReactNode, useState } from 'react';

interface DialogPromptProps {
  children?: ReactNode;
  closeHandler?: (...args: any) => Promise<void>;
  buttonText: string;
  dialogTitle: string;
  dialogDescription: string;
  labelText: string;
  textInput: string;
  backButtonText: string;
  backHandler: (...args: any) => Promise<void>;
  actionButtonText: string;
  actionHandler: (...args: any) => Promise<boolean>;
  successMessage: string;
  errorMessage: string;
}

export default function DialogPrompt({
  children,
  buttonText,
  dialogTitle,
  dialogDescription,
  labelText,
  backButtonText,
  backHandler,
  actionButtonText,
  actionHandler,
  successMessage,
  errorMessage,
}: DialogPromptProps) {
  const [emptyError, setEmptyError] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertLevel, setAlertLevel] = useState<AlertColor>();
  const [input, setInput] = useState('');

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
            value={input}
            onChange={(e) => {
              setEmptyError(!e.target.value);
              setInput(e.target.value);
            }}
            error={emptyError}
            helperText={emptyError ? 'Channel name cannot be empty' : ''}
          ></TextField>
          {children}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // can be improved
              backHandler(input).then(() => {
                if (backButtonText === 'Back') {
                  console.log('BACK BUTTON');
                  return;
                } else {
                  setInput('');
                  setOpen(false);
                }
              });
            }}
            size='large'
          >
            {backButtonText}
          </Button>
          <Button
            disabled={!input}
            onClick={() => {
              setInput('');
              actionHandler(input).then((result) => {
                if (actionButtonText === 'Create') {
                  if (result) {
                    setAlertLevel('success');
                    setOpen(false);
                  } else {
                    setAlertLevel('error');
                  }
                  setSnackbarOpen(true);
                }
              });
            }}
          >
            {actionButtonText}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={(event, reason) => {
          if (reason !== 'clickaway') {
            setSnackbarOpen(false);
          }
        }}
      >
        <Alert
          onClose={(event) => {
            setSnackbarOpen(false);
          }}
          severity={alertLevel}
          variant='filled'
        >
          {alertLevel === 'error' ? errorMessage : successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
