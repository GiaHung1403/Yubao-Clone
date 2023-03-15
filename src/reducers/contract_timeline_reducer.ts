import * as actionTypes from '@actions/types/contract_timeline_type';

const initialState = {
	message: '',
	listContractTimeline: [],
	error: false,
	loading: true,
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case actionTypes.GET_LIST_CONTRACT_TIMELINE:
			return {
				...state,
				loading: true,
				listContractTimeline: [],
			};
		case actionTypes.GET_LIST_CONTRACT_TIMELINE_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listContractTimeline: action.response,
				loading: false,
			};
		case actionTypes.GET_LIST_CONTRACT_TIMELINE_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
				loading: false,
			};
		default:
			return state;
	}
}
