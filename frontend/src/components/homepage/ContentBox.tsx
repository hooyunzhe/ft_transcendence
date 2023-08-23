'use client';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';
import ChatBox from '../chat/ChatBox';
import ProfileBox from '../profile/ProfileBox';
import LeaderboardBox from '../leaderboard/LeaderboardBox';
import AchievementBox from '../achievement/AchievementBox';
import SettingsBox from '../settings/SettingsBox';
import { useCurrentView } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';

export default function ContentBox() {
  const currentView = useCurrentView();
  const [localView, setLocalView] = useState<View | false>(false);
  const [open, setOpen] = useState(false);
  const [toggleTimeoutID, setToggleTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >();

  useEffect(() => {
    clearTimeout(toggleTimeoutID);
    if (currentView) {
      if (open) {
        setOpen(false);
        setToggleTimeoutID(
          setTimeout(() => {
            setLocalView(currentView);
            setOpen(true);
          }, 1250),
        );
      } else {
        setLocalView(currentView);
        setOpen(true);
      }
    } else {
      setOpen(false);
    }
  }, [currentView]);

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
      {localView === View.CHAT && <ChatBox />}
      {localView === View.PROFILE && <ProfileBox />}
      {localView === View.LEADERBOARD && <LeaderboardBox />}
      {localView === View.ACHIEVEMENTS && <AchievementBox />}
      {localView === View.SETTINGS && <SettingsBox />}
    </Drawer>
  );
}
