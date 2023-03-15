import {ofType} from 'redux-observable';
import {mergeMap} from 'rxjs/operators';

import * as actionTypes from '@actions/types/e_coin_type';
import {getECoinTotal, getListECoinReport} from '@data/api';
import {getListOrder} from "@data/api/api_e_coin";

export const getECoinTotalData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_E_COIN_TOTAL),
        mergeMap((action: any) =>
            getECoinTotal(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_E_COIN_TOTAL_SUCCESS,
                        message: 'Get e-coin total thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_E_COIN_TOTAL_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );

export const getListECoinReportData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_LIST_E_COIN_REPORT),
        mergeMap((action: any) =>
            getListECoinReport(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_LIST_E_COIN_REPORT_SUCCESS,
                        message: 'Get danh sách report e-coin thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_LIST_E_COIN_REPORT_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );

export const getListOrderHistoryData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_LIST_ORDER_HISTORY),
        mergeMap((action: any) =>
            getListOrder(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_LIST_ORDER_HISTORY_SUCCESS,
                        message: 'Get danh sách order history thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_LIST_ORDER_HISTORY_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );
