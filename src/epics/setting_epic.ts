import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/setting_type';
import { getSettingPublic } from '@data/api';

export const getSettingPublicRC = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_SETTING_PUBLIC),
    mergeMap((action: any) =>
      getSettingPublic(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_SETTING_PUBLIC_SUCCESS,
            message: 'Get setting public success!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_SETTING_PUBLIC_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
