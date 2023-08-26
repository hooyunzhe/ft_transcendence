export enum UserStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  IN_GAME = 'IN_GAME',
}

export interface User {
  id: number;
  username: string;
  refresh_token: string;
  avatar_url: string;
  two_factor_enabled: boolean;
  date_of_creation: string;
}
