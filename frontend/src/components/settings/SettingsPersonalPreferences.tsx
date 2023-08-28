'use client';
import { Box, Switch, Typography } from '@mui/material';

export default function SettingsPersonalPreferences() {
  return (
    <Box width='100%' display='flex' justifyContent='space-between'>
      <Box>
        <Typography variant='h6'>Music</Typography>
        <Switch
          defaultChecked
          onMouseDown={(event) => event.preventDefault()}
        />
      </Box>
      <Box>
        <Typography variant='h6'>Animations</Typography>
        <Switch
          defaultChecked
          onMouseDown={(event) => event.preventDefault()}
        />
      </Box>
      <Box>
        <Typography variant='h6'>Light Mode</Typography>
        <Switch onMouseDown={(event) => event.preventDefault()} />
      </Box>
    </Box>
  );
}
