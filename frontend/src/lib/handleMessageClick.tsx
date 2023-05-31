import { Message } from '@/types/Message';
import call_API from './callAPI';
import { messageSocket } from '@/lib/messageSocket';
import { User } from '@/types/User';
import { Channel } from '@/types/Channel';

export default function handleMessageClick(message: string) {
  const messageBody = {
    channel_id: 1,
    user_id: 1,
    content: message,
    type: 'text',
  };

  const userDetails: User = {
    id: 1,
    username: 'new_user',
    refresh_token: 'hehehe',
    date_of_creation: new Date(),
  };

  const channelDetail: Channel = {
    id: 1,
    name: 'new_channel',
    type: 'text',
    hash: 'hash',
  };

  const messageThingy: Message = {
    id: 1,
    content: message,
    type: 'test',
    date_of_creation: new Date(),
    channel: channelDetail,
    user: userDetails,
  };

  messageSocket.emit('newMessage', messageThingy, (data: any) => {
    console.log('sending message to server!');
    console.log(data);
  });

  console.log(call_API('messages', 'POST', messageBody));
}
