import * as actionTypes from '@actions/types/setting_type';

const initialState = {
  message: '',
  dataSettings: [],
  error: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_SETTING_PUBLIC_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataSettings: action.response,
      };
    case actionTypes.GET_SETTING_PUBLIC_FAIL:
      return {
        ...state,
        message: action.message,
        error: false,
      };
    default:
      return state;
  }
}
