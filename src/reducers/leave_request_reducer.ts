import * as actionTypes from '@actions/types/leave_request_type';

const initialState = {
  message: '',
  listLeaveRequest: [],
  listDayOffRemaining: [],
  error: false,
  loading: true,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_LEAVE_REQUEST:
      return {
        ...state,
        message: '',
        error: false,
        loading: true,
      };
    case actionTypes.GET_LIST_LEAVE_REQUEST_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listLeaveRequest: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_LEAVE_REQUEST_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_LIST_DAY_OFF_REMAINING:
      return {
        ...state,
        message: '',
        error: false,
        loading: true,
      };
    case actionTypes.GET_LIST_DAY_OFF_REMAINING_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listDayOffRemaining: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_DAY_OFF_REMAINING_FAIL:
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
