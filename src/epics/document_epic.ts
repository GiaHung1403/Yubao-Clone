import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/document_type';
import { getListFileRC } from '@data/api';

export const getListDataFileRC = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_FILE_RC),
    mergeMap((action: any) =>
      getListFileRC(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_FILE_RC_SUCCESS,
            message: 'Get danh sách file RC thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_FILE_RC_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
