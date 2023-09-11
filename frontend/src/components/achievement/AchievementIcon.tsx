'use client';
import {
  Accessibility,
  Accessible,
  AddReaction,
  Campaign,
  ChildCare,
  Church,
  Filter5,
  HeartBroken,
  LooksOne,
  Looks3,
  PhonelinkLock,
  QuestionMark,
  SettingsSuggest,
  SportsMartialArts,
  VolunteerActivism,
} from '@mui/icons-material';

interface AchievementIconProp {
  achievementID: number;
}

export default function AchievementIcon({
  achievementID,
}: AchievementIconProp) {
  switch (achievementID) {
    case 1:
      return <VolunteerActivism />;
    case 2:
      return <HeartBroken />;
    case 3:
      return <AddReaction />;
    case 4:
      return <SportsMartialArts />;
    case 5:
      return <Campaign />;
    case 6:
      return <Accessibility />;
    case 7:
      return <SettingsSuggest />;
    case 8:
      return <ChildCare />;
    case 9:
      return <Looks3 />;
    case 10:
      return <LooksOne />;
    case 11:
      return <Filter5 />;
    case 12:
      return <Accessible />;
    case 13:
      return <PhonelinkLock />;
    case 14:
      return <Church />;
    case 15:
      return <QuestionMark />;
  }
  return null;
}
