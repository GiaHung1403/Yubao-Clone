import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/user_type';
import { getAllUserRC } from '@data/api';

export const getListUserRC = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_ALL_USER_RC),
    mergeMap((action: any) =>
      getAllUserRC(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_ALL_USER_RC_SUCCESS,
            message: 'Get all user rocket chat thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_ALL_USER_RC_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
