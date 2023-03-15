import * as actionTypes from '@actions/types/eReview_type';

const initialState = {
	message: '',
	listRequestEReview: [],
	listCommentEReview: [],
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
		case actionTypes.GET_LIST_REQUEST_E_REVIEW:
			return {
				...state,
				message: '',
				error: false,
				loading: true,
			};
		case actionTypes.GET_LIST_REQUEST_E_REVIEW_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listRequestEReview: action.response,
				loading: false,
			};

		case actionTypes.GET_LIST_REQUEST_E_REVIEW_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
				loading: false,
			};
		case actionTypes.GET_LIST_COMMENT_E_REVIEW_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listCommentEReview: action.response,
			};
		case actionTypes.GET_LIST_COMMENT_E_REVIEW_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
			};
		case actionTypes.SET_KIND_SELECTED_E_REVIEW:
			return {
				...state,
				kindSelected: action.data.kindSelected,
			};
		case actionTypes.SET_REQUEST_ID_E_REVIEW:
			return {
				...state,
				requestID: action.data.requestID,
			};
		case actionTypes.SET_PROPOSED_BY_E_REVIEW:
			return {
				...state,
				proposedBy: action.data.proposedBy,
			};
		case actionTypes.SET_LESSEE_NAME_E_REVIEW:
			return {
				...state,
				lesseeName: action.data.lesseeName,
			};
		case actionTypes.SET_DESCRIPTION_E_REVIEW:
			return {
				...state,
				description: action.data.description,
			};
		case actionTypes.SET_STATUS_SELECTED_E_REVIEW:
			return {
				...state,
				statusSelected: action.data.statusSelected,
			};
		default:
			return state;
	}
}
