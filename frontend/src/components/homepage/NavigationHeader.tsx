'use client';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';
import {
  AssignmentIndRounded,
  ChatRounded,
  EmojiEventsRounded,
  MilitaryTechRounded,
  SettingsRounded,
  SportsTennisRounded,
} from '@mui/icons-material';
import { Avatar, Box, Divider, Drawer, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';

export default function NavigationHeader() {
  const currentView = useCurrentView();
  const { setCurrentView } = useUtilActions();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);

    return () => setOpen(false);
  }, []);

  return (
    <Drawer
      PaperProps={{
        sx: {
          boxSizing: 'border-box',
          width: '35vw',
          height: '6vh',
          marginTop: '0.5vh',
          marginRight: '0.5vh',
          border: 'solid 3px #7209B775',
          borderRadius: '15px',
        },
      }}
      variant='persistent'
      anchor='right'
      transitionDuration={1000}
      open={open}
    >
      <Box
        display='flex'
        height='100%'
        justifyContent='space-evenly'
        alignItems='center'
        paddingLeft='0.5vw'
        paddingRight='0.5vw'
      >
        <Tabs
          value={currentView}
          onChange={(event, newValue) => setCurrentView(newValue)}
          variant='scrollable'
        >
          <Tab
            sx={{
              color: 'green',
            }}
            icon={<SportsTennisRounded />}
            value={View.GAME}
          />
          <Tab icon={<ChatRounded />} value={View.CHAT} />
          <Tab icon={<AssignmentIndRounded />} value={View.PROFILE} />
          <Tab icon={<MilitaryTechRounded />} value={View.LEADERBOARD} />
          <Tab icon={<EmojiEventsRounded />} value={View.ACHIEVEMENTS} />
          <Tab icon={<SettingsRounded />} value={View.SETTINGS} />
        </Tabs>
        <Divider
          sx={{
            height: '3.5vh',
            marginLeft: '0.5vw',
            marginRight: '0.5vw',
          }}
          orientation='vertical'
          variant='middle'
        />
        <Avatar alt='Avatar'></Avatar>
      </Box>
    </Drawer>
  );
}
