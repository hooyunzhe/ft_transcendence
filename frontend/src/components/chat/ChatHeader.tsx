import { Box, Typography } from '@mui/material';

interface ChatHeaderProps {
  name: string;
}

export default function ChatHeader({ name }: ChatHeaderProps) {
  return (
    <Box
      display='flex'
      height='5.5vh'
      justifyContent='center'
      alignItems='center'
      bgcolor='#363636'
    >
      <Typography variant='h4' color='white'>
        {name}
      </Typography>
    </Box>
  );
}
