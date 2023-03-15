import * as actionTypes from '@actions/types/ticket_type';

const initialState = {
	message: '',
	listTicket: [],
	error: false,
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case actionTypes.GET_ALL_TICKET_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listTicket: action.response,
			};
		case actionTypes.GET_ALL_TICKET_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
			};
		default:
			return state;
	}
}
