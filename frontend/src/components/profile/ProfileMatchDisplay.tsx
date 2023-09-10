'use client';
import { Avatar, Box, Typography } from '@mui/material';
import { FitnessCenter, Psychology, ShutterSpeed } from '@mui/icons-material';
import { useGameActions } from '@/lib/stores/useGameStore';
import { useProfileActions } from '@/lib/stores/useProfileStore';
import { Match, SkillClass } from '@/types/MatchTypes';
import { User } from '@/types/UserTypes';

interface ProfileMatchDisplayProps {
  match: Match;
  currentPlayer: User;
}

export default function ProfileMatchDisplay({
  match,
  currentPlayer,
}: ProfileMatchDisplayProps) {
  const { getMatchOpponent, getMatchScore, getMatchClass, getClassName } =
    useGameActions();
  const { setSelectedStatistic } = useProfileActions();
  const matchClass = getMatchClass(match, currentPlayer.id);

  function handleAvatarClick(): void {
    setSelectedStatistic(
      match.player_one.id === currentPlayer.id
        ? match.player_two.id
        : match.player_one.id,
    );
  }

  return (
    <Box
      width='100%'
      height='7.9vh'
      display='flex'
      justifyContent='space-evenly'
      alignItems='center'
      borderRadius='10px'
      // bgcolor={match.winner_id === currentPlayer.id ? '#00930095' : '#EB370095'}
      sx={{
        background:
          match.winner_id === currentPlayer.id
            ? 'linear-gradient(90deg, #00930095, 75%, #EB370095)'
            : 'linear-gradient(90deg, #EB370095, 75%, #00930095)',
      }}
    >
      <Avatar
        src={
          match.player_one.id === currentPlayer.id
            ? match.player_two.avatar_url
            : match.player_one.avatar_url
        }
        alt={
          match.player_one.id === currentPlayer.id
            ? match.player_two.username
            : match.player_one.username
        }
        sx={{
          border: 'solid 1px black',
          cursor: 'pointer',
        }}
        onClick={handleAvatarClick}
      />
      <Box width='10vw'>
        <Typography variant='h6' sx={{ wordBreak: 'break-word' }}>
          {getMatchOpponent(match, currentPlayer.id).username}
        </Typography>
        <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
          {new Date(match.date_of_creation).toLocaleDateString()}
        </Typography>
      </Box>
      <Box
        minWidth='5vw'
        display='flex'
        flexDirection='column'
        justifyContent='space-around'
        alignItems='center'
      >
        <Typography variant='body1'>{getClassName(matchClass)}</Typography>
        {matchClass === SkillClass.STRENGTH && <FitnessCenter />}
        {matchClass === SkillClass.SPEED && <ShutterSpeed />}
        {matchClass === SkillClass.TECH && <Psychology />}
      </Box>
      <Typography minWidth='5vw' variant='h6' align='right'>
        {getMatchScore(match, currentPlayer.id)}
      </Typography>
    </Box>
  );
}
