'use client';

import { useEffect, useState } from 'react';
import Chat from './Chat';
import { Message } from '@/types/Message';
import call_API from '@/lib/call_API';

// Example API calls using fetch and DTO creation
// async function fetchData({
//   messageAPI,
//   usersAPI,
// }: {
//   messageAPI: string;
//   usersAPI: string;
// }) {
//   const domain = 'http://localhost:4242/api/';

//   const promise1 = fetch(domain + messageAPI).then((response1) =>
//     response1.json(),
//   );
//   const promise2 = fetch(domain + usersAPI).then((response2) =>
//     response2.json(),
//   );

//   return await Promise.all([promise1, promise2]);
// }

export default function ChatBox({ messageAPI }: { messageAPI: string }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    async function getChatUsers() {
      const messageData = await call_API(messageAPI);

      setMessages(messageData);
      console.log(messageData);
    }
    getChatUsers();
  }, []);

  console.log('--- Chat Bar ---');

  return (
    <div>
      {messages.map((obj: Message, index: number) => (
        <Chat
          key={index}
          messageObj={obj}
          // username={
          //   messages.find((e: Users) => e.id === obj.sender_id)?.user ?? ''
          // }
        ></Chat>
      ))}
    </div>
  );
}
