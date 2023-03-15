import { IMessage } from "./IMessage";

export interface IRoom {
	_id: string;
	rid: string;
	name: string;
	fname: string;
	t: string;
	msgs: number;
	usersCount: number;
	u: RoomU;
	customFields: CustomFields;
	broadcast: boolean;
	encrypted: boolean;
	ts: Date;
	ro: boolean;
	sysMes: boolean;
	_updatedAt: Date;
	lastMessage: IMessage;
	lm: Date;
	roles : [{}] ;
}

export interface CustomFields {}

export interface RoomU {
  _id: string;
  username: string;
}
