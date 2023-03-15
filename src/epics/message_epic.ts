import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/message_type';
import { getListRoomMessageRC } from '@data/api';

export const getListMessage = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_MESSAGE),
    mergeMap((action: any) =>
      getListRoomMessageRC(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_MESSAGE_SUCCESS,
            message: 'Get list message success!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_MESSAGE_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
