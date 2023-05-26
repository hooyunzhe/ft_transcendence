'use client';

import { Message } from '@/types/Message';
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
import { useState } from 'react';

export default function Chat({
  messageObj,
  username,
}: {
  messageObj: Message;
  username: string;
}) {
  console.log();
  console.log(username);
  console.log(messageObj.content);

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
              <Grid item>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={username}
                      secondary={messageObj.content}
                    ></ListItemText>
                  </ListItem>
                </List>
              </Grid>
              <Grid item></Grid>
              <Grid item></Grid>
              <Grid item></Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
