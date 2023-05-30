import call_API from '@/lib/call_API';
import { Message } from '@/types/Message';
import { FormControl, Grid, IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

export default function ChatBar({ messageObj }: { messageObj: Message[] }) {
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
          onClick={(event) => {
            if (message) {
              const socket = io('http://localhost:4242/gateway/messages', {
                query: {
                  id: 1,
                },
              });
              socket.emit(
                'sendmessage',
                (data: any) => {
                  console.log('sending message to server!');
                  console.log(data);
                },
                [],
              );

              console.log('send~');
              console.log(messageObj);
              console.log(call_API('messages', 'POST', messageObj));
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
