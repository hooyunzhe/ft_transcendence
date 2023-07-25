'use client';
import { Box, Stack } from '@mui/material';
import ChatDisplay from './ChatDisplay';
import { MessageType } from '@/types/MessageTypes';

export default function ChatBox() {
  return (
    <Box>
      <Stack padding='7px' spacing={1}>
        <ChatDisplay
          {...{
            id: 1,
            content: 'Test Message',
            dateOfCreation: new Date(),
            type: MessageType.TEXT,
            user: {
              id: 1,
              username: 'YZ',
              date_of_creation: new Date(),
              refresh_token: 'Test Token',
            },
          }}
        />
      </Stack>
    </Box>
  );
}
