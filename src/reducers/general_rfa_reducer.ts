import * as actionTypes from '@actions/types/general_rfa_type';

const initialState = {
    message: '',
    listGeneralRFA: [],
    error: false,
    loading: true,
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case actionTypes.GET_LIST_GENERAL_RFA:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.GET_LIST_GENERAL_RFA_SUCCESS:
            return {
                ...state,
                message: action.message,
                error: false,
                listGeneralRFA: action.response,
                loading: false,
            };
        case actionTypes.GET_LIST_GENERAL_RFA_FAIL:
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
