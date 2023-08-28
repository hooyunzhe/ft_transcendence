'use client';
import { Avatar, Box } from '@mui/material';
import ListHeader from '../utils/ListHeader';
import SettingsUsernameSegment from './SettingsUsernameSegment';
import SettingsTwoFactorSegment from './SettingsTwoFactorSegment';
import SettingsPersonalPreferences from './SettingsPersonalPreferences';
import SettingsAccountDangerZone from './SettingsAccountDangerZone';
import { useCurrentUser } from '@/lib/stores/useUserStore';
import { ListHeaderIcon } from '@/types/UtilTypes';

export default function SettingsBox() {
  const currentUser = useCurrentUser();

  return (
    <Box
      height='100%'
      display='flex'
      flexDirection='column'
      justifyContent='space-between'
    >
      <ListHeader title='Settings' icon={ListHeaderIcon.SETTINGS} />
      <Box
        alignSelf='center'
        width='50%'
        height='100%'
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        alignItems='center'
        padding='1.5vw'
        border='solid 5px #7209B775'
        borderRadius='10px'
        bgcolor='#a291d275'
      >
        <Avatar
          src={currentUser.avatar_url}
          sx={{
            width: '125px',
            height: '125px',
            border: 'solid 1px black',
          }}
        />
        <SettingsUsernameSegment />
        <SettingsTwoFactorSegment />
        <SettingsPersonalPreferences />
        <SettingsAccountDangerZone />
      </Box>
    </Box>
  );
}
