import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/dashboard_type';
import {
  getDelinquent,
  getInsuranceInformed,
  getNPV,
  getRecovery,
  getSummaryProgress,
} from '@data/api';

export const getDataSummaryProgress = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_SUMMARY_PROGRESS),
    mergeMap((action: any) =>
      getSummaryProgress(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_SUMMARY_PROGRESS_SUCCESS,
            message: 'Get data summary progress success!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_SUMMARY_PROGRESS_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getDataNPV = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_NPV),
    mergeMap((action: any) =>
      getNPV(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_NPV_SUCCESS,
            message: 'Get data NPV success!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_NPV_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getDataRecovery = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_RECOVERY),
    mergeMap((action: any) =>
      getRecovery(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_RECOVERY_SUCCESS,
            message: 'Get Recovery success!',
            response: data[0],
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_RECOVERY_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getDataDelinquent = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_DELINQUENT),
    mergeMap((action: any) =>
      getDelinquent(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_DELINQUENT_SUCCESS,
            message: 'Get Delinquent success!',
            response: data[0],
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_DELINQUENT_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getDataInsuranceInformed = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_INSURANCE_INFORMED),
    mergeMap((action: any) =>
      getInsuranceInformed(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_INSURANCE_INFORMED_SUCCESS,
            message: 'Get Insurance Informed success!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_INSURANCE_INFORMED_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
