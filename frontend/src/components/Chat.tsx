'use client';

import { Message } from '@/types/Message';
import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import './Chat.css';

export default function Chat({ messageObj }: { messageObj: Message }) {
  console.log(messageObj.content);

  const [message, setMessage] = useState('');

  return (
    <>
      <Container>
        <Paper elevation={5}>
          <Box p={3}>
            <Typography variant='h4' gutterBottom>
              Happy Failing~
            </Typography>
            <Divider />
            <Grid container spacing={4} alignItems='center'>
              <Grid id='chat-window' xs={12} item>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={`${messageObj.user.username}: ${messageObj.content}`}
                    ></ListItemText>
                  </ListItem>
                </List>
              </Grid>
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
                      console.log('send~');
                    }
                  }}
                  aria-label='send'
                  color='primary'
                >
                  <SendIcon />
                </IconButton>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
