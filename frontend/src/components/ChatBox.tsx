'use client';

import { useEffect, useState } from 'react';
import Chat from './Chat';
import { Message } from '@/types/Message';
import call_API from '@/lib/call_API';
import { io } from 'socket.io-client';
import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import ChatBar from './ChatBar';

export default function ChatBox({ messageAPI }: { messageAPI: string }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // getting mess
    async function getChatUsers() {
      const messageData = await call_API(messageAPI, 'GET');
      setMessages(messageData);
      console.log(messageData);
    }
    getChatUsers();
  }, []);

  console.log('--- Chat Bar After Use Effect!---');

  return (
    <>
      <Container>
        <Paper elevation={5}>
          <Box p={3}>
            <Typography variant='h4' gutterBottom>
              Chat Box
            </Typography>
            <Divider />
            <Grid container spacing={4} alignItems='center'>
              <Grid id='chat-window' xs={12} item>
                <List>
                  {messages.map((obj: Message, index: number) => (
                    <Chat key={index} {...obj}></Chat>
                  ))}
                </List>
              </Grid>
              {/* // I shouldn't map this */}
              <ChatBar messageObj={messages}></ChatBar>
              <Grid item></Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
