
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useGameActions, useMatchInfo } from '@/lib/stores/useGameStore';
import { useEffect } from 'react';
import { useUtilActions } from '@/lib/stores/useUtilStore';
import { View } from '@/types/UtilTypes';


interface PlayerCardProps {
  name: string,
  avatar: string,
  side: string,
}
export default function GameMatchFound() {

  const matchInfo = useMatchInfo();
  if (!matchInfo) return (<div></div>);
  const PlayerCard = ({name, avatar, side}: PlayerCardProps ) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: side === 'left' ? 'row' : 'row-reverse',
        alignItems: 'center',
        width: '50%',
        padding: '20px',
        borderBottom: '1px solid #ccc',
      }}
    >
      <Avatar sx={{ width: 100, height: 100, marginRight: '20px' }} src={avatar} alt={name} />
      <Typography variant="h5" sx={{ color: 'white' }}>
        {name}
      </Typography>
    </Box>
 
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0e0e2a',
      }}
    >
      <PlayerCard
      name={matchInfo.player1.nickname}
      avatar={matchInfo.player1.avatar}
        side="left"
      />
      <Typography
        variant="h2"
        sx={{
          color: 'white',
          marginTop: '20px',
          marginBottom: '20px',
          position: 'relative',
          fontFamily: 'sans-serif',
          fontSize: '4rem',
        }}
      >
        <span
          // style={{
          //   position: 'absolute',
          //   width: '100%',
          //   height: '100%',
          //   background: 'linear-gradient(45deg, #FF4500, #FF0000, #FF4500)',
          //   backgroundClip: 'text', 
          //   color: 'transparent', 
          //   animation: 'burn 2s infinite',
          //   clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)',
          // }}
        >
          VS
        </span>
      </Typography>
      <PlayerCard
     name={matchInfo.player2.nickname}
     avatar={matchInfo.player2.avatar}
        side="right"
      />
    </Box>
  );
}
