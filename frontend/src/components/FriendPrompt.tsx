'use client';
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
import { useState } from 'react';

interface FriendPromptProps {
  addFriend: (username: string) => Promise<boolean>;
}

export default function FriendPrompt({ addFriend }: FriendPromptProps) {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertLevel, setAlertLevel] = useState<AlertColor>();
  const [username, setUsername] = useState('');

  return (
    <>
      <Button
        variant='contained'
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Friend
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        maxWidth='xs'
        fullWidth
      >
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin='dense'
            id='username'
            label='Add friends by their username'
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              addFriend(username).then((result) => {
                if (result) {
                  setAlertLevel('success');
                  setSnackbarOpen(true);
                  setOpen(false);
                } else {
                  setAlertLevel('error');
                  setSnackbarOpen(true);
                }
              });
            }}
          >
            Send Request
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
          {alertLevel === 'error' ? 'User not found' : 'Request sent'}
        </Alert>
      </Snackbar>
    </>
  );
}
