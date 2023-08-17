'use client';
import { Box, Typography } from '@mui/material';
import { useGameActions } from '@/lib/stores/useGameStore';
import { Match } from '@/types/MatchTypes';
import { User } from '@/types/UserTypes';
import ProfileSkillIcon from './ProfileSkillIcon';

interface ProfileMatchDisplayProps {
  match: Match;
  currentPlayer: User;
}

export default function ProfileMatchDisplay({
  match,
  currentPlayer,
}: ProfileMatchDisplayProps) {
  const {
    getMatchOpponent,
    getMatchScore,
    getMatchSkills,
    getMatchPath,
    getPathName,
  } = useGameActions();

  return (
    <Box
      height='6vh'
      display='flex'
      justifyContent='space-evenly'
      alignItems='center'
      border={`solid 2px ${
        match.winner_id === currentPlayer.id ? '#4A8179' : '#EB370050'
      }`}
      borderRadius='10px'
      bgcolor={match.winner_id === currentPlayer.id ? '#00C5AD' : '#EB370085'}
    >
      <Box width='10vw'>
        <Typography variant='h5'>
          {getMatchOpponent(match, currentPlayer.id).username}
        </Typography>
        <Typography variant='body2' color='rgba(0, 0, 0, 0.6)'>
          {new Date(match.date_of_creation).toLocaleDateString()}
        </Typography>
      </Box>
      <Box
        width='8vw'
        display='flex'
        flexDirection='column'
        justifyContent='space-around'
        alignItems='flex-start'
      >
        <Typography variant='body1'>
          {getPathName(getMatchPath(match, currentPlayer.id))}
        </Typography>
        <Box>
          {getMatchSkills(match, currentPlayer.id).map((skillID) => (
            <ProfileSkillIcon skillID={skillID} />
          ))}
        </Box>
      </Box>
      <Typography width='4vw' variant='h6' align='right'>
        {getMatchScore(match, currentPlayer.id)}
      </Typography>
    </Box>
  );
}
