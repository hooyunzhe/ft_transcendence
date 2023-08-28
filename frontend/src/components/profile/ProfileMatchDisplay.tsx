'use client';
import { Avatar, Box, Typography } from '@mui/material';
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
      width='100%'
      height='7.9vh'
      display='flex'
      justifyContent='space-evenly'
      alignItems='center'
      border={`solid 2px ${
        match.winner_id === currentPlayer.id ? '#4A8179' : '#EB370050'
      }`}
      borderRadius='10px'
      bgcolor={match.winner_id === currentPlayer.id ? '#00C5AD' : '#EB370085'}
    >
      <Avatar
        src={
          match.player_one.id === currentPlayer.id
            ? match.player_two.avatar_url
            : match.player_one.avatar_url
        }
        sx={{
          border: 'solid 1px black',
        }}
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
        display='flex'
        flexDirection='column'
        justifyContent='space-around'
        alignItems='flex-start'
      >
        <Typography variant='body1'>
          {getPathName(getMatchPath(match, currentPlayer.id))}
        </Typography>
        <Box>
          {getMatchSkills(match, currentPlayer.id).map((skillID, index) => (
            <ProfileSkillIcon key={index} skillID={skillID} />
          ))}
        </Box>
      </Box>
      <Typography minWidth='5vw' variant='h6' align='right'>
        {getMatchScore(match, currentPlayer.id)}
      </Typography>
    </Box>
  );
}
