import * as actionTypes from '@actions/types/message_type';

const initialState = {
  message: '',
  listMessage: [],
  listUserTyping: [],
  error: false,
  loading: false,
};

const updateListUserTyping = (typingResponse, listTyping) => {
  const indexItemExisted = listTyping.findIndex(
    (item: any) => item.username === typingResponse.username,
  );
  if (indexItemExisted > -1) {
    listTyping[indexItemExisted] = typingResponse;
    return [];
  } else {
    const objectData = {
      username: typingResponse.username,
      isTyping: typingResponse.isTyping,
    };
    return [...listTyping, objectData];
  }
};

export default function (state = initialState, action: any) {
  switch (action.type) {
		case actionTypes.GET_LIST_MESSAGE:
			return {
				...state,
				message: action.message,
				error: false,
				loading: true,
			};
		case actionTypes.GET_LIST_MESSAGE_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listMessage: [].concat(action.response),
				loading: false,
			};
		case actionTypes.GET_LIST_MESSAGE_FAIL:
			return {
				...state,
				message: action.message,
				error: false,
				loading: false,
			};
		case actionTypes.SET_USER_TYPING:
			return {
				...state,
				message: action.message,
				error: false,
				listUserTyping: updateListUserTyping(
					action.response,
					state.listUserTyping,
				),
			};
		case actionTypes.CLEAR_USER_TYPING:
			return {
				...state,
				message: "",
				error: false,
				listUserTyping: [],
			};
		default:
			return state;
	}
}
