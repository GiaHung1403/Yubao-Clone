import * as actionTypes from '@actions/types/e_coin_type';

const initialState = {
  message: '',
  listECoinReport: [],
  listOrderHistory: [],
  eCoinTotal: 0,
  error: false,
  loading: true,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_E_COIN_TOTAL_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        eCoinTotal: action.response,
        loading: false,
      };
    case actionTypes.GET_E_COIN_TOTAL_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_LIST_E_COIN_REPORT:
      return {
        ...state,
        loading: true,
        listECoinReport: [],
      };
    case actionTypes.GET_LIST_E_COIN_REPORT_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listECoinReport: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_E_COIN_REPORT_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_LIST_ORDER_HISTORY:
      return {
        ...state,
        loading: true,
        listOrderHistory: [],
      };
    case actionTypes.GET_LIST_ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listOrderHistory: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_ORDER_HISTORY_FAIL:
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
