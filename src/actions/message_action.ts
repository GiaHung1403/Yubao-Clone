import {
  CLEAR_USER_TYPING,
  GET_LIST_MESSAGE,
  SET_NEW_MESSAGE,
  SET_USER_TYPING,
} from './types/message_type';

export const getListMessage = ({ roomID, token, UserID, type }) => ({
  type: GET_LIST_MESSAGE,
  data: {
    roomID,
    token,
    UserID,
    type,
  },
});

export const setUserTyping = ({ user }) => ({
  type: SET_USER_TYPING,
  response: user,
});

export const clearUserTyping = () => ({
	type: CLEAR_USER_TYPING,
});


export const setNewMessage = ({ newMessage }) => ({
  type: SET_NEW_MESSAGE,
  response: newMessage,
});
