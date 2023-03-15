import * as actionTypes from '@actions/types/notification_type';

const initialState = {
  message: '',
  listPromotion: [],
  listNotification: [],
  numberUnreadPromotion: 0,
  numberUnreadNotification: 0,
  error: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
		case actionTypes.SET_LIST_NOTIFICATION:
			return {
				...state,
				message: action.message,
				error: false,
				listNotification: action.response,
			};
		case actionTypes.SET_NUMBER_UNREAD_NOTIFICATION:
			return {
				...state,
				message: action.message,
				numberUnreadNotification: action.response,
				error: true,
			};
		case actionTypes.SET_LIST_PROMOTION:
			return {
				...state,
				message: action.message,
				error: false,
				listPromotion: action.response,
			};
		case actionTypes.SET_NUMBER_UNREAD_PROMOTION:
			return {
				...state,
				message: action.message,
				numberUnreadPromotion: action.response,
				error: true,
			};
		case actionTypes.GET_NUMBER_UNREAD_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
				loading: false,
			};
		case actionTypes.GET_NUMBER_UNREAD_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				loading: false,
				numberUnreadNotification: action.response,
			};
		default:
			return state;
	}
}
