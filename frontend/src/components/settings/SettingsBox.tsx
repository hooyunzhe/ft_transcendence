'use client';
import { Box } from '@mui/material';
import ToolbarHeader from '../utils/ToolbarHeader';
import SettingsAvatarSegment from './SettingsAvatarSegment';
import SettingsUsernameSegment from './SettingsUsernameSegment';
import SettingsTwoFactorSegment from './SettingsTwoFactorSegment';
import SettingsPersonalPreferences from './SettingsPersonalPreferences';
import SettingsAccountDangerZone from './SettingsAccountDangerZone';
import { ToolbarHeaderType } from '@/types/UtilTypes';

export default function SettingsBox() {
  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ToolbarHeader title='Settings' type={ToolbarHeaderType.SETTINGS} />
      <Box
        alignSelf='center'
        width='50%'
        height='100%'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        alignItems='center'
        padding='1.5vw'
        borderRadius='10px'
        bgcolor='#a291d275'
      >
        <SettingsAvatarSegment />
        <SettingsUsernameSegment />
        <SettingsTwoFactorSegment />
        <SettingsPersonalPreferences />
        <SettingsAccountDangerZone />
      </Box>
    </Box>
  );
}
