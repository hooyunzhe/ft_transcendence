export enum PreferenceType {
  MUSIC = 'MUSIC',
  ANIMATIONS = 'ANIMATIONS',
  LIGHT_MODE = 'LIGHT_MODE',
}

export interface Preference {
  id: number;
  music_enabled: boolean;
  animations_enabled: boolean;
  light_mode_enabled: boolean;
}
