import * as actionTypes from '@actions/types/room_rc_type';
import normalizeMessage from '@data/helpers/normalizeMessage';
import { IMemberRoom, ISubscriptionsRC } from '@models/types';

interface IState {
	message: string;
	listRoomMemberRC: IMemberRoom[];
	listUserInvited: any[];
	listRoom: ISubscriptionsRC[];
	error: boolean;
	loading: boolean;
	numberMessageUnread: number;
	listRequest : any[];
}

const initialState: IState = {
	message: '',
	listRoomMemberRC: [],
	listUserInvited: [],
	listRoom: [],
	numberMessageUnread: 0,
	error: false,
	loading: false,
	listRequest : []
};

const setRoomChange = ({ room, listRoom }) => {
	const listRoomOld: ISubscriptionsRC[] = [].concat(listRoom);
	const indexRoom = listRoomOld.findIndex(
		r => r.rid === room.rid || r.rid === room._id,
	);
	if (indexRoom > -1) {
		if (room.lastMessage) {
			room.lastMessage = normalizeMessage(room.lastMessage);
		}

		listRoomOld[indexRoom] = Object.assign(listRoomOld[indexRoom], room);
	}
	return listRoomOld;
};

const countNumberUnread = listRoom => {
	return listRoom.reduce((total, currentItem) => {
		const isUnreadMessage =
			(currentItem.unread > 0 ||
				currentItem.tunread?.length > 0 ||
				currentItem.alert) &&
			!currentItem.hideUnreadStatus;
		const unread =
			currentItem.unread > 0 ? currentItem.unread : isUnreadMessage ? 1 : 0;
		return total + unread;
	}, 0);
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case actionTypes.GET_LIST_ROOM_RC:
			return {
				...state,
				message: '',
				loading: true,
			};
		case actionTypes.GET_LIST_ROOM_RC_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listRoom: [].concat(action.response),
				numberMessageUnread: countNumberUnread([].concat(action.response)),
				loading: false,
			};
		case actionTypes.GET_LIST_ROOM_RC_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
				loading: false,
			};
		case actionTypes.SET_ROOM_CHANGE:
			const listRoomChange = setRoomChange({
				room: action.data.room,
				listRoom: state.listRoom,
			});
			return {
				...state,
				message: action.message,
				listRoom: listRoomChange,
				numberMessageUnread: countNumberUnread(listRoomChange),
			};
		case actionTypes.SET_NUMBER_MESSAGE_UNREAD:
			return {
				...state,
				message: action.message,
				error: false,
				numberMessageUnread: state.numberMessageUnread + action.data.count,
			};
		case actionTypes.GET_LIST_ROOM_MEMBER_RC_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listRoomMemberRC: action.response,
			};
		case actionTypes.GET_LIST_ROOM_MEMBER_RC_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
			};
		case actionTypes.ADD_USER_INVITED_RC:
			return {
				...state,
				listUserInvited: [...state.listUserInvited, ...action.data.user],
			};
		case actionTypes.REMOVE_USER_INVITED_RC:
			const listData = [...state.listUserInvited];
			listData.splice(action.data.index, 1);
			return {
				...state,
				listUserInvited: [...listData],
			};

		case actionTypes.REMOVE_All_USER_INVITED_RC:
			return {
				...state,
				listUserInvited: [],
			};

		case actionTypes.GET_LIST_REQUEST:
			return {
				...state,
				message: '',
				loading: true,
			};
		case actionTypes.GET_LIST_REQUEST_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listRequest: action.response,
			};
		case actionTypes.GET_LIST_REQUEST_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
			};
		default:
			return state;
	}
}
