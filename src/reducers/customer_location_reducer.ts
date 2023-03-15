import * as actionTypes from '@actions/types/customer_location_type';

const initialState = {
  message: '',
  listLocation: [],
  error: false,
  loading: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_LOCATION_CUSTOMER_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listLocation: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_LOCATION_CUSTOMER_FAIL:
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
