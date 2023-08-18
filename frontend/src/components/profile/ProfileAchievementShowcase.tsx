'use client';
import { Box } from '@mui/material';
import ProfileAchievementDisplay from './ProfileAchievementDisplay';

export default function ProfileAchievementShowcase() {
  const tempData = [
    {
      name: 'My First Game!',
      description: 'Play one game of Cyberpong™',
      date_of_creation: new Date().toISOString(),
    },
    {
      name: 'Aint lonely no more',
      description: 'Make a friend',
      date_of_creation: new Date().toISOString(),
    },
    {
      name: 'Wai you so pro',
      description: 'Have a 5 winstreak',
      date_of_creation: new Date().toISOString(),
    },
    {
      name: `I don't love you, like I did, yesterday`,
      description: 'Have a 5 winstreak',
      date_of_creation: new Date().toISOString(),
    },
    // {
    //   name: 'Off the plank you go',
    //   description: 'Have a 5 winstreak',
    //   date_of_creation: new Date().toISOString(),
    // },
  ];

  return (
    <Box
      width='28vw'
      height='36vh'
      display='flex'
      flexWrap='wrap'
      justifyContent='flex-start'
      alignContent='flex-start'
      alignItems='center'
      padding='5px'
      gap='1vh'
      border='solid 5px #7209B775'
      borderRadius='10px'
      bgcolor='#a291d275'
    >
      {tempData.map((data, index) => (
        <ProfileAchievementDisplay key={index} {...data} />
      ))}
    </Box>
  );
}
