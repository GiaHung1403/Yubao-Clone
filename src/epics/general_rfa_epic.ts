import {ofType} from 'redux-observable';
import {mergeMap} from 'rxjs/operators';

import * as actionTypes from '@actions/types/general_rfa_type';
import {getListGeneralRFA} from "@data/api/api_general_rfa";

export const getListGeneralRFAData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_LIST_GENERAL_RFA),
        mergeMap((action: any) =>
            getListGeneralRFA(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_LIST_GENERAL_RFA_SUCCESS,
                        message: 'Get danh sách general RFA thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_LIST_GENERAL_RFA_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );
