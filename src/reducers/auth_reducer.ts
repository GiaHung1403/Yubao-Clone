import * as actionTypes from '@actions/types/auth_type';
import { IUserSystem } from '@models/types';

interface IState {
  message: string;
  dataUserSystem?: IUserSystem;
  dataUserRC: any;
  error: boolean;
}

const initialState: IState = {
  message: '',
  dataUserSystem: undefined,
  dataUserRC: null,
  error: false,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.LOGIN || actionTypes.LOGIN_RC:
      return {
        ...state,
        message: '',
        error: false,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataUserSystem: action.response,
      };
    case actionTypes.LOGIN_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
      };
    case actionTypes.LOGIN_RC:
      return {
        ...state,
        message: '',
        error: false,
      };
    case actionTypes.LOGIN_RC_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataUserRC: action.response,
      };
    case actionTypes.LOGIN_RC_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
      };
    default:
      return state;
  }
}
