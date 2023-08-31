'use client';
import { Box, Switch, Typography } from '@mui/material';
import {
  useCurrentPreference,
  useUserActions,
} from '@/lib/stores/useUserStore';
import { PreferenceType } from '@/types/PreferenceTypes';
import callAPI from '@/lib/callAPI';

export default function SettingsPersonalPreferences() {
  const currentPreference = useCurrentPreference();
  const { changeCurrentPreference } = useUserActions();

  async function handlePreferenceToggle(
    type: PreferenceType,
    checked: boolean,
  ): Promise<void> {
    await callAPI('PATCH', 'preferences', {
      id: currentPreference.id,
      ...(type === PreferenceType.MUSIC && { music_enabled: checked }),
      ...(type === PreferenceType.ANIMATIONS && {
        animations_enabled: checked,
      }),
      ...(type === PreferenceType.LIGHT_MODE && {
        light_mode_enabled: checked,
      }),
    });
    changeCurrentPreference(type, checked);
  }

  return (
    <Box width='100%' display='flex' justifyContent='space-between'>
      <Box>
        <Typography variant='h6'>Music</Typography>
        <Switch
          checked={currentPreference.music_enabled}
          onMouseDown={(event) => event.preventDefault()}
          onChange={(event) =>
            handlePreferenceToggle(PreferenceType.MUSIC, event.target.checked)
          }
        />
      </Box>
      <Box>
        <Typography variant='h6'>Animations</Typography>
        <Switch
          checked={currentPreference.animations_enabled}
          onMouseDown={(event) => event.preventDefault()}
          onChange={(event) =>
            handlePreferenceToggle(
              PreferenceType.ANIMATIONS,
              event.target.checked,
            )
          }
        />
      </Box>
      <Box>
        <Typography variant='h6'>Light Mode</Typography>
        <Switch
          checked={currentPreference.light_mode_enabled}
          onMouseDown={(event) => event.preventDefault()}
          onChange={(event) =>
            handlePreferenceToggle(
              PreferenceType.LIGHT_MODE,
              event.target.checked,
            )
          }
        />
      </Box>
    </Box>
  );
}
