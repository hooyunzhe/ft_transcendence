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
  date_of_creation: Date;
}
