import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/eFlow_type';
import { getListApproverEFlow, getListRequestEFlow } from '@data/api';

export const getListDataRequestEFlow = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_REQUEST_E_FLOW),
    mergeMap((action: any) =>
      getListRequestEFlow(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_REQUEST_E_FLOW_SUCCESS,
            message: 'Get danh sách request e-flow thành công!',
            response: data,
            isEReview: action.data.isEReview,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_REQUEST_E_FLOW_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getListDataApproverEFlow = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_APPROVER_E_FLOW),
    mergeMap((action: any) =>
      getListApproverEFlow(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_APPROVER_E_FLOW_SUCCESS,
            message: 'Get danh sách approver e-flow thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_APPROVER_E_FLOW_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
