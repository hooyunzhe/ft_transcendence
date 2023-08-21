'use client';
import {
  AddRoad,
  ArrowCircleUp,
  ErrorOutline,
  FastForwardOutlined,
  FastRewindOutlined,
  Height,
  Help,
  KeyboardDoubleArrowDown,
  PlayForWork,
  SettingsRemoteOutlined,
  Shuffle,
  SmartButton,
  Speed,
  SwapVert,
  TrendingDown,
  Update,
} from '@mui/icons-material';

interface ProfileSkillIconProps {
  skillID: number;
}

export default function ProfileSkillIcon({ skillID }: ProfileSkillIconProps) {
  switch (skillID) {
    case 1:
      return <ArrowCircleUp />; // Increase ball speed
    case 2:
      return <Height />; // Increase paddle size
    case 3:
      return <PlayForWork />; // Sticky paddle
    case 4:
      return <ErrorOutline />; // Strong hit
    case 5:
      return <AddRoad />; // Deploy extra small paddle
    case 6:
      return <Speed />; // Increase paddle speed
    case 7:
      return <KeyboardDoubleArrowDown />; // Reduce incoming ball speed
    case 8:
      return <SmartButton />; // Paddle assist
    case 9:
      return <FastForwardOutlined />; // Speed up time
    case 10:
      return <FastRewindOutlined />; // Slow down time
    case 11:
      return <Update />; // Reduce ability cooldown
    case 12:
      return <TrendingDown />; // Reduce enemy paddle speed
    case 13:
      return <Shuffle />; // Invert ball angle
    case 14:
      return <SwapVert />; // Invert paddle
    case 15:
      return <SettingsRemoteOutlined />; // Control enemy paddle
  }
  return <Help />;
}
