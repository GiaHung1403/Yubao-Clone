import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/eReview_type';
import { getListCommentEReview, getListRequestEReview } from '@data/api';

export const getListDataRequestEReview = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_REQUEST_E_REVIEW),
    mergeMap((action: any) =>
      getListRequestEReview(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_REQUEST_E_REVIEW_SUCCESS,
            message: 'Get danh sách e-review thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_REQUEST_E_REVIEW_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getListDataCommentEReview= (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_COMMENT_E_REVIEW),
    mergeMap((action: any) =>
      getListCommentEReview(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_COMMENT_E_REVIEW_SUCCESS,
            message: 'Get danh sách comment e-review thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_COMMENT_E_REVIEW_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
