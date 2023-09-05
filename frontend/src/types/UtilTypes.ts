export enum View {
  GAME = 'GAME',
  CHAT = 'CHAT',
  PROFILE = 'PROFILE',
  LEADERBOARD = 'LEADERBOARD',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  SETTINGS = 'SETTINGS',
}

export enum ToolbarHeaderType {
  NONE = 'NONE',
  SOCIAL = 'SOCIAL',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
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
