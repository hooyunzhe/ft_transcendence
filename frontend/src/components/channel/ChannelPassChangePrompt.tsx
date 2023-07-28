import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useChannelActions } from '@/lib/stores/useChannelStore';

interface ChangePassChangePromptProps {
  channelID: number;
  channelHash: string;
}

export default function ChannelPassChangePrompt({
  channelID,
  channelHash,
}: ChangePassChangePromptProps) {
  const [open, setOpen] = useState(false);

  const [newPass, setNewPass] = useState('');
  const [oldPass, setOldPass] = useState('');
  const { changeChannelHash } = useChannelActions();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function checkPasswordMatch() {
    if (newPass === oldPass) {
      // changeChannelHash();
    }
  }

  function handlePasswordChange(channelID: number) {
    if (newPass === oldPass) {
      // changeChannelHash();
    }
  }

  return (
    <div>
      <Button
        sx={{
          color: 'black',
          background: 'white',
        }}
        variant='outlined'
        onClick={handleClickOpen}
      >
        Change channel password
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Kill yourself</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Key in new password and old password.
          </DialogContentText>
          <TextField
            margin='dense'
            label='Old Password'
            fullWidth
            variant='standard'
            onChange={(e) => {
              setNewPass(e.target.value);
              // onChangeHandler(e.target.value);
            }}
          />
          <TextField
            margin='dense'
            label='New Password'
            fullWidth
            variant='standard'
            onChange={(e) => {
              setOldPass(e.target.value);
              // onChangeHandler(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Change</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
