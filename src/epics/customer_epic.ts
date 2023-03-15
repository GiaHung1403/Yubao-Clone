import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/customer_type';
import { getListCustomer, getListSeller } from '@data/api';
import { ICustomer } from '@models/types';

export const getListDataCustomer = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_CUSTOMER),
    mergeMap((action: any) =>
      getListCustomer(action.data)
        .then(async (data) => {
          const listCustomer = data as ICustomer[];
          return {
            type: actionTypes.GET_LIST_CUSTOMER_SUCCESS,
            message: 'Get list customer success!',
            response: listCustomer,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_CUSTOMER_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );

export const getListDataSeller = (action$: any) =>
  action$.pipe(
    ofType(actionTypes.GET_LIST_SELLER),
    mergeMap((action: any) =>
      getListSeller(action.data)
        .then(async (data: any) => {
          return {
            type: actionTypes.GET_LIST_SELLER_SUCCESS,
            message: 'Get list seller success!',
            response: data,
          };
        })
        .catch((error: any) => ({
          type: actionTypes.GET_LIST_SELLER_FAIL,
          message: error.message,
          code: error.code,
        })),
    ),
  );
