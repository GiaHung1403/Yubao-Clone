export interface IUserLoginRC {
  userId: string;
  authToken: string;
  me: Me;
}

export interface Me {
  _id: string;
  services: Services;
  username: string;
  emails: Email[];
  status: string;
  active: boolean;
  roles: string[];
  name: string;
  requirePasswordChange: boolean;
  settings: Settings;
  statusText: string;
  statusConnection: string;
  utcOffset: number;
  avatarUrl: string;
}

export interface Email {
  address: string;
  verified: boolean;
}

export interface Services {
  password: Password;
}

export interface Password {
  bcrypt: string;
}

export interface Settings {
  preferences: Preferences;
}

export interface Preferences {
  enableAutoAway: boolean;
  idleTimeLimit: number;
  desktopNotificationDuration: number;
  audioNotifications: string;
  desktopNotifications: string;
  mobileNotifications: string;
  unreadAlert: boolean;
  useEmojis: boolean;
  convertAsciiEmoji: boolean;
  autoImageLoad: boolean;
  saveMobileBandwidth: boolean;
  collapseMediaByDefault: boolean;
  hideUsernames: boolean;
  hideRoles: boolean;
  hideFlexTab: boolean;
  hideAvatars: boolean;
  sidebarGroupByType: boolean;
  sidebarViewMode: string;
  sidebarHideAvatar: boolean;
  sidebarShowUnread: boolean;
  sidebarShowFavorites: boolean;
  sendOnEnter: string;
  messageViewMode: number;
  emailNotificationMode: string;
  roomCounterSidebar: boolean;
  newRoomNotification: string;
  newMessageNotification: string;
  muteFocusedConversations: boolean;
  notificationsSoundVolume: number;
  sidebarShowDiscussion: boolean;
}
