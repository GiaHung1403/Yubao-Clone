import {ofType} from 'redux-observable';
import {mergeMap} from 'rxjs/operators';

import * as actionTypes from '@actions/types/consultation_type';
import {getListConsultation} from "@data/api";

export const getListConsultationData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_LIST_CONSULTATION),
        mergeMap((action: any) =>
            getListConsultation(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_LIST_CONSULTATION_SUCCESS,
                        message: 'Get danh sách consultation thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_LIST_CONSULTATION_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );
