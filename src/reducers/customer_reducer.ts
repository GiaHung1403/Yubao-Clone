import * as actionTypes from '@actions/types/customer_type';

const initialState = {
  message: '',
  listCustomer: [],
  listSeller: [],
  error: false,
  loading: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_CUSTOMER:
      return {
        ...state,
        loading: true,
        listCustomer: [],
      };
    case actionTypes.GET_LIST_CUSTOMER_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listCustomer: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_CUSTOMER_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_LIST_SELLER:
      return {
        ...state,
        loading: true,
        listSeller: [],
      };
    case actionTypes.GET_LIST_SELLER_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listSeller: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_SELLER_FAIL:
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
