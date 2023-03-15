import * as actionTypes from '@actions/types/eFlow_type';

const initialState = {
	message: '',
	listRequestEFlow: [],
	listRequestEReview: [],
	listApproverEFlow: [],
	error: false,
	loading: false,
	kindSelected: '',
	requestID: '',
	proposedBy: '',
	lesseeName: '',
	description: '',
	statusSelected: '',
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case actionTypes.GET_LIST_REQUEST_E_FLOW:
			return {
				...state,
				message: '',
				error: false,
				loading: true,
			};
		case actionTypes.GET_LIST_REQUEST_E_FLOW_SUCCESS:
			if (action.isEReview) {
				return {
					...state,
					message: action.message,
					error: false,
					listRequestEReview: action.response,
					loading: false,
				};
			}

			return {
				...state,
				message: action.message,
				error: false,
				listRequestEFlow: action.response,
				loading: false,
			};

		case actionTypes.GET_LIST_REQUEST_E_FLOW_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
				loading: false,
			};
		case actionTypes.GET_LIST_APPROVER_E_FLOW_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listApproverEFlow: action.response,
			};
		case actionTypes.GET_LIST_APPROVER_E_FLOW_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
			};
		case actionTypes.SET_KIND_SELECTED_E_FLOW:
			return {
				...state,
				kindSelected: action.data.kindSelected,
			};
		case actionTypes.SET_REQUEST_ID_E_FLOW:
			return {
				...state,
				requestID: action.data.requestID,
			};
		case actionTypes.SET_PROPOSED_BY_E_FLOW:
			return {
				...state,
				proposedBy: action.data.proposedBy,
			};
		case actionTypes.SET_LESSEE_NAME_E_FLOW:
			return {
				...state,
				lesseeName: action.data.lesseeName,
			};
		case actionTypes.SET_DESCRIPTION_E_FLOW:
			return {
				...state,
				description: action.data.description,
			};
		case actionTypes.SET_STATUS_SELECTED_E_FLOW:
			return {
				...state,
				statusSelected: action.data.statusSelected,
			};
		default:
			return state;
	}
}
