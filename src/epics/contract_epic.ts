import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/contract_type';
import { getContractList } from '@data/api';

export const getListContract = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_CONTRACT),
    mergeMap((action: any) =>
      getContractList(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_CONTRACT_SUCCESS,
            message: 'Get hợp đồng thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_CONTRACT_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
