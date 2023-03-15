import * as actionTypes from '@actions/types/quotation_type';

const initialState = {
  message: '',
  listQuotation: [],
  listTenorQuotation: [],
  quotationDetail: null,
  quotationCalculation: null,
  error: false,
  loading: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_QUOTATION:
      return {
        ...state,
        message: '',
        error: false,
        loading: true,
        quotationDetail: null,
        listTenorQuotation: [],
      };
    case actionTypes.GET_LIST_QUOTATION_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        loading: false,
        listQuotation: action.response,
      };
    case actionTypes.GET_LIST_QUOTATION_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_QUOTATION_DETAIL_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        loading: false,
        quotationDetail: action.response,
      };
    case actionTypes.GET_QUOTATION_DETAIL_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_LIST_TENOR_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        loading: false,
        listTenorQuotation: action.response,
      };
    case actionTypes.GET_LIST_TENOR_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.SET_LIST_TENOR:
      return {
        ...state,
        message: action.message,
        error: false,
        loading: false,
        listTenorQuotation: action.data,
      };
    case actionTypes.CALCULATION_QUOTATION_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        loading: false,
        quotationCalculation: action.response,
      };
    case actionTypes.CALCULATION_QUOTATION_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.RESET_QUOTATION_RESULT:
      return {
        ...state,
        message: action.message,
        error: false,
        loading: false,
        quotationCalculation: null,
        listTenorQuotation: null,
        quotationDetail: null,
      };
    default:
      return state;
  }
}
