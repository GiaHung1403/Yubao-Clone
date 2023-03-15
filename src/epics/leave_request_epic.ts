import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/leave_request_type';
import { getListDayOffRemaining, getListLeaveRequest } from '@data/api';
import { ILeaveRequest } from '@models/types';

export const getListLeaveRequestData = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_LEAVE_REQUEST),
    mergeMap((action: any) =>
      getListLeaveRequest(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_LEAVE_REQUEST_SUCCESS,
            message: 'Get danh sách leave request thành công!',
            response: data.filter((item: ILeaveRequest) => item.pic === action.data.memberID),
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_LEAVE_REQUEST_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getListDayOffRemainingData = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_DAY_OFF_REMAINING),
    mergeMap((action: any) =>
      getListDayOffRemaining(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_DAY_OFF_REMAINING_SUCCESS,
            message: 'Get danh sách day-off remaining thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_DAY_OFF_REMAINING_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
