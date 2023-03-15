import * as actionTypes from '@actions/types/request_customer_type';

interface IState {
  message: string;
  assetCheckingRequests?: any[];
  error: boolean;
}

const initialState: IState = {
  message: '',
  assetCheckingRequests: [],
  error: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_ASSET_CHECKING_REQUESTS:
      return {
        ...state,
        message: '',
        error: false,
      };
    case actionTypes.GET_ASSET_CHECKING_REQUESTS_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        assetCheckingRequests: action.response,
      };
    case actionTypes.GET_ASSET_CHECKING_REQUESTS_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
      };
    default:
      return state;
  }
}
