import * as actionTypes from '@actions/types/document_type';

const initialState = {
  message: '',
  listFileRC: [],
  error: false,
  loading: true,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_FILE_RC_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listFileRC: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_FILE_RC_FAIL:
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
