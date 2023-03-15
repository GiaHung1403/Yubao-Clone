import * as actionTypes from '@actions/types/contract_type';

const initialState = {
  message: '',
  data: [],
  error: false,
  loading: true,
  listDeptVND: [],
  listDeptUSD: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_CONTRACT:
      return {
        ...state,
        loading: true,
        listDeptVND: [],
        listDeptUSD: [],
        data: [],
      };
    case actionTypes.GET_LIST_CONTRACT_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        data: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_CONTRACT_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.SET_LIST_DEPT_AMOUNT_VND:
      return {
        ...state,
        listDeptVND:
          state.listDeptVND.findIndex(
            (item: any) => item.id === action.response.id,
          ) === -1
            ? [...state.listDeptVND, action.response]
            : state.listDeptVND,
      };
    case actionTypes.SET_LIST_DEPT_AMOUNT_USD:
      return {
        ...state,
        listDeptUSD:
          state.listDeptUSD.findIndex(
            (item: any) => item.id === action.response.id,
          ) === -1
            ? [...state.listDeptUSD, action.response]
            : state.listDeptUSD,
      };
    case actionTypes.RESET_LIST_DEPT_AMOUNT_VND:
      return {
        ...state,
        listDeptVND: [],
        data: [],
      };
    case actionTypes.RESET_LIST_DEPT_AMOUNT_USD:
      return {
        ...state,
        listDeptUSD: [],
        data: [],
      };
    default:
      return state;
  }
}
