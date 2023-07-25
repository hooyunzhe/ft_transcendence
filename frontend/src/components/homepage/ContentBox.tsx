'use client';
import { Box, Drawer } from '@mui/material';
import ChatBox from '../chat/ChatBox';

export default function ContentBox() {
  return (
    <Drawer
      PaperProps={{
        sx: {
          boxSizing: 'border-box',
          width: '60vw',
        },
      }}
      variant='persistent'
      anchor='bottom'
      open
    >
      <Box border='solid 5px #7209B775' borderRadius='15px'>
        <ChatBox />
      </Box>
    </Drawer>
  );
}
