'use client';

import { useEffect, useState } from 'react';
import { messageSocket } from '@/lib/messageSocket';
import Chat from './Chat';
import { Message } from '@/types/Message';
import callAPI from '@/lib/callAPI';
import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  Paper,
  Typography,
} from '@mui/material';
import ChatBar from './ChatBar';

export default function ChatBox() {
  const [messageList, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    async function getChatUsers() {
      const messageData = JSON.parse(await callAPI('GET', 'messages'));
      setMessages(messageData);
      console.log(messageData);
    }
    getChatUsers();

    messageSocket.on('newMessage', (data: Message) => {
      console.log('Yes received from server!');
      console.log(`You are connected with id ${messageSocket.id}`);
      setMessages((messageData) => [...messageData, data]);
    });
  }, []);

  console.log('-- Printing ChatBox --');

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
                  {messageList.map(
                    (obj: Message, index: number) =>
                      index >= messageList.length - 5 && (
                        <Chat key={index} {...obj}></Chat>
                      ),
                  )}
                </List>
              </Grid>
              <ChatBar />
              <Grid item></Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
