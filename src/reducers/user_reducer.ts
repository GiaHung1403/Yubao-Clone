import * as actionTypes from "@actions/types/user_type";

const initialState = {
  message: "",
  listUserRC: [],
  error: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_ALL_USER_RC_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listUserRC: action.response,
      };
    case actionTypes.GET_ALL_USER_RC_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
      };
    default:
      return state;
  }
}
