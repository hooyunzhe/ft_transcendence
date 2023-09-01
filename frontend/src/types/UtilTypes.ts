export enum View {
  PHASER = 'PHASER',
  LOADING = 'LOADING',
  GAME = 'GAME',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  SETTINGS = 'SETTINGS',
}

export enum ListHeaderType {
  SOCIAL = 'SOCIAL',
  CHANNEL_MEMBER = 'CHANNEL_MEMBER',
  LEADERBOARD = 'LEADERBOARD',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  SETTINGS = 'SETTINGS',
}

export enum SocialTab {
  FRIEND = 'FRIEND',
  CHANNEL = 'CHANNEL',
}

export enum FriendCategory {
  FRIENDS = 'FRIENDS',
  PENDING = 'PENDING',
  INVITED = 'INVITED',
  BLOCKED = 'BLOCKED',
}

export interface APIResponse {
  status: number;
  body: any;
}
