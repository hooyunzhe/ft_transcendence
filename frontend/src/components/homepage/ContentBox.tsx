'use client';
import { useEffect, useState } from 'react';
import { Drawer } from '@mui/material';
import ChatBox from '../chat/ChatBox';
import ProfileBox from '../profile/ProfileBox';
import LeaderboardBox from '../leaderboard/LeaderboardBox';
import AchievementBox from '../achievement/AchievementBox';
import SettingsBox from '../settings/SettingsBox';
import { useCurrentView } from '@/lib/stores/useUtilStore';
import { useCurrentPreference } from '@/lib/stores/useUserStore';
import { View } from '@/types/UtilTypes';
import GameMenu from '../game/GameMenu';
import GameRender from '../game/GameRender';
import GameTransition from '../game/GameTransition';

export default function ContentBox() {
  const currentView = useCurrentView();
  const currentPreference = useCurrentPreference();
  const [localView, setLocalView] = useState<View | false>(false);
  const [open, setOpen] = useState(false);
  const [toggleTimeoutID, setToggleTimeoutID] = useState<
    NodeJS.Timeout | undefined
  >();

  useEffect(() => {
    clearTimeout(toggleTimeoutID);
    if (currentView) {
      if (open && currentPreference.animations_enabled) {
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
          width: '59.7vw',
          height: '70vh',
          left: '20.15vw',
          bottom: '15vh',
          border: 'solid 5px #7209B775',
          borderRadius: '15px',
          background: '#11111175',
        },
      }}
      variant='persistent'
      anchor='bottom'
      transitionDuration={currentPreference.animations_enabled ? 1000 : 0}
      open={open}
    >
      {localView === View.CHAT && <ChatBox />}
      {localView === View.PROFILE && <ProfileBox />}
      {localView === View.GAME && <GameMenu />}
      {localView === View.LOADING && <GameTransition />}
      {localView === View.PHASER && <GameRender />}
      {localView === View.LEADERBOARD && <LeaderboardBox />}
      {localView === View.ACHIEVEMENTS && <AchievementBox />}
      {localView === View.SETTINGS && <SettingsBox />}
    </Drawer>
  );
}
