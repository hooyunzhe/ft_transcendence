'use client';
import {
  Accessibility,
  Accessible,
  AddReaction,
  Campaign,
  ChildCare,
  Filter5,
  HeartBroken,
  MilitaryTech,
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
      return <MilitaryTech />;
    case 10:
      return <Filter5 />;
    case 11:
      return <Accessible />;
    // case 12:
    //   return <Help />; // Not decided
  }
  return null;
}
