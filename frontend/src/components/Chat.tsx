'use client';

import { ListItem, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import './Chat.css';
import { Message } from '@/types/Message';

export default function Chat({
  id,
  content,
  type,
  date_of_creation,
  channel,
  user,
}: Message) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function getChatUsers() {
      // const messageData = await call_API(messageAPI, 'GET');
      // setMessages(messageData);
      // console.log(messageData);
    }
    getChatUsers();
  }, []);

  return (
    <ListItem>
      {/* Where we have to put our chat box contents */}
      <ListItemText primary={`${user.username}: ${content}`}></ListItemText>
    </ListItem>
  );
}
