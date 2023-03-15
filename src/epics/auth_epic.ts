import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/auth_type';
import { loginSystem } from '@data/api';
import AsyncStorage from '@data/local/AsyncStorage';
import { RocketChat } from '@data/rocketchat';
import { IUserLoginRC } from '@models/types';

export const login = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.LOGIN),
    mergeMap((action: any) =>
      loginSystem(action.data)
        .then(async (data: any) => {
          await AsyncStorage.setDataUserSystem(data);
          return {
            type: actionTypes.LOGIN_SUCCESS,
            message: 'Đăng nhập system thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.LOGIN_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const loginRC = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.LOGIN_RC),
    mergeMap((action: any) =>
      RocketChat.login(action.data)
        .then(async (data: IUserLoginRC) => {
          await AsyncStorage.setUserTokenRC(data.authToken);
          return {
            type: actionTypes.LOGIN_RC_SUCCESS,
            message: 'Đăng nhập rocket chat thành công!',
            response: data,
          };
        })
        .catch((error: any) => {
          return {
            type: actionTypes.LOGIN_RC_FAIL,
            message: error.message,
            code: error.code,
          };
        }),
    ),
  );
