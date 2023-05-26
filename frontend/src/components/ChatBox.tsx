'use client';

import { useEffect, useState } from 'react';
import Chat from './Chat';
import { Message } from '@/types/Message';
import { Users } from '@/types/Users';
import { MessageSharp } from '@mui/icons-material';

// Example API calls using fetch and DTO creation
async function fetchData({
  messageAPI,
  usersAPI,
}: {
  messageAPI: string;
  usersAPI: string;
}) {
  const domain = 'http://localhost:4242/api/';

  const promise1 = fetch(domain + messageAPI).then((response1) =>
    response1.json(),
  );
  const promise2 = fetch(domain + usersAPI).then((response2) =>
    response2.json(),
  );

  return await Promise.all([promise1, promise2]);
}

export default function ChatBox({
  messageAPI,
  usersAPI,
}: {
  messageAPI: string;
  usersAPI: string;
}) {
  // const data = await call_API(API);
  // const chatData = await fetchData({ messageAPI, usersAPI });
  const [chats, setChats] = useState<Message[]>([]);
  const [users, setUsers] = useState<Users[]>([]);

  useEffect(() => {
    async function getChatUsers() {
      const [messages, users] = await fetchData({ messageAPI, usersAPI });

      setChats(messages);
      setUsers(users);
      console.log(messages);
      console.log(users);
    }
    getChatUsers();
  }, []);

  console.log('--- Chat Bar ---');

  return (
    <div>
      {chats.map((obj: Message, index: number) => (
        <Chat
          key={index}
          messageObj={obj}
          username={
            users.find((e: Users) => e.id === obj.sender_id)?.username ?? ''
          }
        ></Chat>
      ))}
    </div>
  );
  // data2.find((e: Users) => e.id === message.sender_id);
}
