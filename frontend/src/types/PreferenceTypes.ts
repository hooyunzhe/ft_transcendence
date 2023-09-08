export enum PreferenceType {
  MUSIC = 'MUSIC',
  SOUND_EFFECTS = 'SOUND_EFFECTS',
  ANIMATIONS = 'ANIMATIONS',
}

export interface Preference {
  id: number;
  music_enabled: boolean;
  sound_effects_enabled: boolean;
  animations_enabled: boolean;
}
