import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/cic_type';
import {getListCIC} from '@data/api';

export const getListCICData = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_CIC),
    mergeMap((action: any) =>
      getListCIC(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_CIC_SUCCESS,
            message: 'Get danh sách cic thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_CIC_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
