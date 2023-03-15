import * as actionTypes from '@actions/types/cic_type';

const initialState = {
  message: '',
  listCICRequest: [],
  error: false,
  loading: true,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_CIC:
      return {
        ...state,
        loading: true,
        listCICRequest: [],
      };
    case actionTypes.GET_LIST_CIC_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listCICRequest: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_CIC_FAIL:
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
