'use client';
import { useEffect, useState } from 'react';
import { Avatar, Box, Divider, Drawer, Tab, Tabs } from '@mui/material';
import {
  AssignmentInd,
  Chat,
  EmojiEvents,
  Leaderboard,
  Settings,
  SportsEsports,
} from '@mui/icons-material';
import {
  useCurrentPreference,
  useCurrentUser,
} from '@/lib/stores/useUserStore';
import { useCurrentView, useUtilActions } from '@/lib/stores/useUtilStore';
import { useMatchState } from '@/lib/stores/useGameStore';
import {
  useProfileActions,
  useSelectedStatistic,
} from '@/lib/stores/useProfileStore';
import { MatchState } from '@/types/GameTypes';
import { View } from '@/types/UtilTypes';

export default function NavigationHeader() {
  const currentUser = useCurrentUser();
  const currentPreference = useCurrentPreference();
  const currentView = useCurrentView();
  const selectedStatistic = useSelectedStatistic();
  const matchState = useMatchState();
  const { setSelectedStatistic, resetSelectedStatistic } = useProfileActions();
  const { setCurrentView, changeCurrentView } = useUtilActions();
  const [open, setOpen] = useState(false);

  function handleAvatarClick(): void {
    if (
      currentView === View.PROFILE &&
      selectedStatistic?.user.id === currentUser.id
    ) {
      resetSelectedStatistic();
    } else {
      setSelectedStatistic(currentUser.id);
      setCurrentView(View.PROFILE);
    }
  }

  useEffect(() => {
    setOpen(true);

    return () => setOpen(false);
  }, []);

  return (
    <Drawer
      PaperProps={{
        sx: {
          boxSizing: 'border-box',
          width: '37vw',
          height: '6vh',
          marginTop: '0.5vh',
          marginRight: '0.5vh',
          border: 'solid 3px #7209B775',
          borderRadius: '15px',
          bgcolor: '#A4B5C6',
        },
      }}
      variant='persistent'
      anchor='right'
      transitionDuration={500}
      open={
        matchState !== MatchState.INGAME &&
        (open || !currentPreference.animations_enabled)
      }
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
              color: '#ba413a',
            }}
            icon={<SportsEsports />}
            value={View.GAME}
            onClick={() => changeCurrentView(View.GAME)}
          />
          <Tab
            icon={<Chat />}
            value={View.CHAT}
            onClick={() => changeCurrentView(View.CHAT)}
          />
          <Tab
            icon={<AssignmentInd />}
            value={View.PROFILE}
            onClick={() => changeCurrentView(View.PROFILE)}
          />
          <Tab
            icon={<Leaderboard />}
            value={View.LEADERBOARD}
            onClick={() => changeCurrentView(View.LEADERBOARD)}
          />
          <Tab
            icon={<EmojiEvents />}
            value={View.ACHIEVEMENTS}
            onClick={() => changeCurrentView(View.ACHIEVEMENTS)}
          />
          <Tab
            icon={<Settings />}
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
        <Avatar
          src={currentUser.avatar_url}
          alt={currentUser.username}
          sx={{
            border: 'solid 1px black',
            cursor: 'pointer',
          }}
          onClick={handleAvatarClick}
        />
      </Box>
    </Drawer>
  );
}
