import { FormControl, Grid, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import handleMessageClick from '@/lib/handleMessageClick';
import { messageSocket } from '@/lib/messageSocket';

export default function ChatBar() {
  const [message, setMessage] = useState('');
  const [typingText, setTypingText] = useState('');

  let isTyping = true;
  useEffect(() => {
    messageSocket.on('typing', () => {
      if (isTyping === true) {
        setTypingText('Send help...');
      } else setTypingText('');
    });
  }, []);

  let timeout;

  return (
    <>
      <Grid xs={8} item>
        <FormControl fullWidth>
          <TextField
            onChange={(event: any) => {
              setMessage(event.target.value);
              messageSocket.emit('typing', { isTyping: true });
              timeout = setTimeout(() => {
                console.log('timeout functino');
                messageSocket.emit('typing', { isTyping: false });
              }, 2000);
            }}
            value={message}
            label='Type your message...'
            variant='outlined'
            helperText={typingText}
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
