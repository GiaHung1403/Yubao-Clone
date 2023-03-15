import { RoomType } from "@models/RoomTypeEnum";

export default interface ISpotlight {
	_id: string;
	fname: string;
	name: string;
	rid: string;
	status: string;
	statusText: string;
	username: string;
	t: RoomType;
}