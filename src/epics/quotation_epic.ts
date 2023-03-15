import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/quotation_type';
import {
  calculationQuotation,
  getListQuotation,
  getListQuotationTenor,
  getQuotationDetail,
} from '@data/api';

export const getListDataQuotation = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_QUOTATION),
    mergeMap((action: any) =>
      getListQuotation(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_QUOTATION_SUCCESS,
            message: 'Get list quotation thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_QUOTATION_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getDataQuotationDetail = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_QUOTATION_DETAIL),
    mergeMap((action: any) =>
      getQuotationDetail(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_QUOTATION_DETAIL_SUCCESS,
            message: 'Get quotation detail thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_QUOTATION_DETAIL_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getListDataQuotationTenor = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_TENOR),
    mergeMap((action: any) =>
      getListQuotationTenor(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_TENOR_SUCCESS,
            message: 'Get list tenor quotation thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_QUOTATION_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const calculationDataQuotation = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.CALCULATION_QUOTATION),
    mergeMap((action: any) =>
      calculationQuotation(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.CALCULATION_QUOTATION_SUCCESS,
            message: 'Calculation quotation thành công!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.CALCULATION_QUOTATION_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
