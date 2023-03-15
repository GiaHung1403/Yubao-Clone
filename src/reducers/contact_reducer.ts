import * as actionTypes from '@actions/types/contact_type';

const initialState = {
	message: '',
	listContact: [],
	listContactFilter: [],
	error: false,
	loading: false,
	departmentSelected: null,
	branchSelected: null,
	keyword: '',
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case actionTypes.GET_LIST_CONTACT:
			return {
				...state,
				message: '',
				error: false,
				loading: true,
			};
		case actionTypes.GET_LIST_CONTACT_SUCCESS:
			return action.response.isFilter
				? {
						...state,
						message: action.message,
						error: false,
						listContactFilter: action.response.data,
						loading: false,
				  }
				: {
						...state,
						message: action.message,
						error: false,
						listContact: action.response.data,
						listContactFilter: action.response.data,
						loading: false,
				  };
		case actionTypes.GET_LIST_CONTACT_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
				loading: false,
			};
		case actionTypes.SET_KEYWORD_SEARCH:
			return {
				...state,
				keyword: action.data.keyword,
			};
		case actionTypes.SET_DEPARTMENT_SELECTED:
			return {
				...state,
				departmentSelected: action.data.departmentSelected,
			};
		case actionTypes.SET_BRANCH_SELECTED:
			return {
				...state,
				branchSelected: action.data.branchSelected,
			};
		default:
			return state;
	}
}
