// To parse this data:
//
//   import { Convert, ISubscriptionsRC } from "./file";
//
//   const iSubscriptionsRC = Convert.toISubscriptionsRC(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ISubscriptionsRC {
  _id: string;
  _updatedAt: Date;
  alert: boolean;
  announcement: string;
  archived: boolean;
  autoTranslate: boolean;
  blocked: boolean;
  blocker: boolean;
  broadcast: boolean;
  description: string;
  fname: string;
  groupMentions: number;
  jitsiTimeout: string;
  joinCodeRequired: string;
  lastMessage: LastMessage;
  ls: Date;
  muted: any[];
  name: string;
  open: boolean;
  reactWhenReadOnly: string;
  rid: string;
  ro: boolean;
  roles: any[];
  roomUpdatedAt: Date;
  sysMes: boolean;
  t: string;
  topic: string;
  ts: Date;
  u: U;
  uids: string;
  unread: number;
  userMentions: number;
  usernames: string;
}

export interface LastMessage {
  _id: string;
  _updatedAt: Date;
  attachments: any[];
  bot: Bot;
  channels: any[];
  mentions: any[];
  msg: string;
  reactions: any[];
  rid: string;
  starred: string;
  ts: Date;
  u: U;
  unread: boolean;
  urls: any[];
}

export interface Bot {
  i: string;
}

export interface U {
  _id: string;
  name: string;
  username: string;
}
