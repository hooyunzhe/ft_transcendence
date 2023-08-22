'use client';
import { useEffect, useState } from 'react';
import { Avatar, Box, Divider, Drawer, Tab, Tabs } from '@mui/material';
import {
  AssignmentIndRounded,
  ChatRounded,
  EmojiEventsRounded,
  LeaderboardRounded,
  SettingsRounded,
  SportsTennisRounded,
} from '@mui/icons-material';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { View } from '@/types/UtilTypes';

export default function NavigationHeader() {
  const currentUser = useCurrentUser();
  const currentView = useCurrentView();
  const { setSelectedStatistic } = useProfileActions();
  const { setCurrentView, changeCurrentView } = useUtilActions();
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
          variant='scrollable'
          onMouseDown={(event) => event.preventDefault()}
        >
          <Tab
            sx={{
              color: 'green',
            }}
            icon={<SportsTennisRounded />}
            value={View.GAME}
            onClick={() => changeCurrentView(View.GAME)}
          />
          <Tab
            icon={<ChatRounded />}
            value={View.CHAT}
            onClick={() => changeCurrentView(View.CHAT)}
          />
          <Tab
            icon={<AssignmentIndRounded />}
            value={View.PROFILE}
            onClick={() => changeCurrentView(View.PROFILE)}
          />
          <Tab
            icon={<LeaderboardRounded />}
            value={View.LEADERBOARD}
            onClick={() => changeCurrentView(View.LEADERBOARD)}
          />
          <Tab
            icon={<EmojiEventsRounded />}
            value={View.ACHIEVEMENTS}
            onClick={() => changeCurrentView(View.ACHIEVEMENTS)}
          />
          <Tab
            icon={<SettingsRounded />}
            value={View.SETTINGS}
            onClick={() => changeCurrentView(View.SETTINGS)}
          />
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
        <Box
          onClick={() => {
            setSelectedStatistic(currentUser.id);
            setCurrentView(View.PROFILE);
          }}
        >
          <Avatar
            src={currentUser.avatar_url}
            sx={{
              border: 'solid 1px black',
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
}
