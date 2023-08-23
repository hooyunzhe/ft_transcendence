'use client';
import { Box } from '@mui/material';
import ListHeader from '../utils/ListHeader';
import SettingsAccountSection from './SettingsAccountSection';
import { ListHeaderIcon } from '@/types/UtilTypes';

export default function SettingsBox() {
  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ListHeader title='Settings' icon={ListHeaderIcon.SETTINGS} />
      <SettingsAccountSection />
    </Box>
  );
}
