import {
	ADD_USER_INVITED_RC,
	GET_LIST_ROOM_MEMBER_RC,
	GET_LIST_ROOM_RC,
	REMOVE_USER_INVITED_RC,
	SET_NUMBER_MESSAGE_UNREAD,
	SET_ROOM_CHANGE,
	REMOVE_All_USER_INVITED_RC,
	GET_LIST_REQUEST,
} from './types/room_rc_type';

export const getListRoomMemberRC = ({ roomID, token, UserID, type }) => ({
  type: GET_LIST_ROOM_MEMBER_RC,
  data: {
    roomID,
    token,
    UserID,
    type,
  },
});

export const getListRoomRC = () => ({
  type: GET_LIST_ROOM_RC,
});

export const setRoomChange = ({ room }) => ({
  type: SET_ROOM_CHANGE,
  data: {
    room,
  },
});

export const setNumberMessageUnread = ({ count }) => ({
  type: SET_NUMBER_MESSAGE_UNREAD,
  data: {
    count,
  },
});

export const addUserInvitedRC = ({ user }) => ({
  type: ADD_USER_INVITED_RC,
  data: {
    user,
  },
});

export const removeUserInvitedRC = ({ index }) => ({
  type: REMOVE_USER_INVITED_RC,
  data: {
    index,
  },
});

export const removeAllUserInvitedRC = () => ({
	type: REMOVE_All_USER_INVITED_RC,
	data: {
	},
});

export const get_ListRequest = ({roomID, token, UserID}) => ({
	type: GET_LIST_REQUEST,
	data: {
		roomID,
		token,
		UserID,
	},
});

