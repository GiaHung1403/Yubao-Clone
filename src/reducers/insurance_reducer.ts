import * as actionTypes from '@actions/types/insurance_type';

const initialState = {
	message: '',
	insuranceContracts: [],
	error: false,
	loading: true,
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case actionTypes.GET_LIST_INSURANCE_CONTRACT:
			return {
				...state,
				loading: true,
			};
		case actionTypes.GET_LIST_INSURANCE_CONTRACT_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				insuranceContracts: action.response,
				loading: false,
			};
		case actionTypes.GET_LIST_INSURANCE_CONTRACT_FAIL:
			return {
				...state,
				insuranceContracts: [],
				message: action.message,
				error: true,
				loading: false,
			};
		default:
			return state;
	}
}
