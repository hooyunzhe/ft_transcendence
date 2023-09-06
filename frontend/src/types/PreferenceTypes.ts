export enum PreferenceType {
  MUSIC = 'MUSIC',
  ANIMATIONS = 'ANIMATIONS',
}

export interface Preference {
  id: number;
  music_enabled: boolean;
  animations_enabled: boolean;
}
