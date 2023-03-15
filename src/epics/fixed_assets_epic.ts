import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/fixed_assets_type';
import {getListFixedAsset} from '@data/api';

export const getListFixedAssetsData = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_FIXED_ASSET),
    mergeMap((action: any) =>
      getListFixedAsset(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_FIXED_ASSET_SUCCESS,
            message: 'Get danh sách fixed asset thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_FIXED_ASSET_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
