import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface FriendPromptProps {
  addFriend: (username: string) => void;
}

export default function FriendPrompt({ addFriend }: FriendPromptProps) {
  const [open, setOpen] = useState(false);
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
      >
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
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
              addFriend(username);
              setOpen(false);
            }}
          >
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
