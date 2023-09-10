'use client';
import { Avatar, Box, Typography } from '@mui/material';
import { useMatchInfo } from '@/lib/stores/useGameStore';

interface PlayerCardProps {
  name: string;
  avatar: string;
  side: string;
}
export default function GameMatchFound() {
  const matchInfo = useMatchInfo();
  if (!matchInfo) return <div></div>;
  const PlayerCard = ({ name, avatar, side }: PlayerCardProps) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: side === 'left' ? 'row' : 'row-reverse',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '80%',
      }}
    >
      <Avatar
        sx={{ width: 100, height: 100, border: 'solid 1px black' }}
        src={avatar}
        alt={name}
      />
      <Typography
        fontFamily='cyberthrone'
        letterSpacing='1rem'
        variant='h2'
        color='white'
      >
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
        width: '80vh',
        backgroundColor: '#0e0e2a30',
      }}
    >
      <PlayerCard
        name={matchInfo.player1.nickname}
        avatar={matchInfo.player1.avatar}
        side='left'
      />
      <Typography
        variant='h2'
        sx={{
          color: 'white',
          marginTop: '20px',
          marginBottom: '20px',
          position: 'relative',
          fontFamily: 'cyberfont',
          fontSize: '4rem',
        }}
      >
        <span>VS</span>
      </Typography>
      <PlayerCard
        name={matchInfo.player2.nickname}
        avatar={matchInfo.player2.avatar}
        side='right'
      />
    </Box>
  );
}
