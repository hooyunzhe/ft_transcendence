'use client';
import { Drawer } from '@mui/material';
import ChatBox from '../chat/ChatBox';
import { useEffect, useState } from 'react';

export default function ContentBox() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  return (
    <Drawer
      PaperProps={{
        sx: {
          boxSizing: 'border-box',
          width: '60vw',
          height: '70vh',
          left: '20vw',
          bottom: '15vh',
          border: 'solid 5px #363636',
          borderRadius: '15px',
          background: '#3A0CA375',
        },
      }}
      variant='persistent'
      anchor='bottom'
      transitionDuration={1000}
      open={open}
    >
      <ChatBox />
    </Drawer>
  );
}
