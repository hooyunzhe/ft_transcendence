import { CheckBox } from '@mui/icons-material';
import {
  Alert,
  AlertColor,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
} from '@mui/material';
import { ReactNode, useState } from 'react';

interface DialogPromptProps {
  children?: ReactNode;
  buttonText: string;
  dialogTitle: string;
  labelText: string;
  actionButtonText: string;
  actionHandler: (...args: any) => Promise<boolean>;
  successMessage: string;
  errorMessage: string;
}

export default function DialogPrompt({
  children,
  buttonText,
  dialogTitle,
  labelText,
  actionButtonText,
  actionHandler,
  successMessage,
  errorMessage,
}: DialogPromptProps) {
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
          <TextField
            autoFocus
            fullWidth
            margin='dense'
            id='input'
            label={labelText}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          ></TextField>
          {children}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              actionHandler(input).then((result) => {
                if (result) {
                  setAlertLevel('success');
                  setOpen(false);
                } else {
                  setAlertLevel('error');
                }
                setSnackbarOpen(true);
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
