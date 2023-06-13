import { FormControl, Grid, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import handleMessageClick from '@/lib/handleMessageClick';
import { messageSocket } from '@/lib/messageSocket';

export default function ChatBar() {
  const [message, setMessage] = useState('');
  const [typingText, setTypingText] = useState('');
  const [isTypingState, setIsTypingState] = useState(false);
  const [timeElapsed, setTimeElasped] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    messageSocket.on('typing', (typingEvent: boolean) => {
      if (typingEvent === true) {
        setTypingText('Receiving help...');
      } else {
        setTypingText('');
      }
    });
  }, []);

  useEffect(() => {
    if (isTypingState === true) {
      messageSocket.emit('typing', true);
    } else {
      messageSocket.emit('typing', false);
    }
  }, [isTypingState]);

  const updateElapsedTime = () => {
    setTimeElasped(new Date());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateElapsedTime();
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    let seconds = (timeElapsed.getTime() - startTime.getTime()) / 1000;

    // console.log('seconds = ', seconds);

    if (seconds >= 5 && isTypingState === true) {
      setIsTypingState(false);
      setStartTime(new Date());
      setTimeElasped(new Date());
    } else if (isTypingState === false) {
      setTimeElasped(new Date());
      setStartTime(new Date());
    }
  }, [timeElapsed]);

  return (
    <>
      <Grid xs={8} item>
        <FormControl fullWidth>
          <TextField
            onChange={(event: any) => {
              setMessage(event.target.value);
              setStartTime(new Date());
              setIsTypingState(true);
            }}
            value={message}
            label='Type your message...'
            variant='outlined'
            helperText={typingText}
            autoComplete='off'
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
