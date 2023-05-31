import { FormControl, Grid, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import handleMessageClick from '@/lib/handleMessageClick';

export default function ChatBar() {
  const [message, setMessage] = useState('');

  return (
    <>
      <Grid xs={8} item>
        <FormControl fullWidth>
          <TextField
            onChange={(event: any) => {
              setMessage(event.target.value);
            }}
            value={message}
            label='Type your message...'
            variant='outlined'
          />
        </FormControl>
      </Grid>
      <Grid xs={1} item>
        <IconButton
          onClick={() => {
            if (message) {
              handleMessageClick(message);
              setMessage('');
            }
          }}
          aria-label='send'
          color='primary'
        >
          <SendIcon />
        </IconButton>
      </Grid>
    </>
  );
}
