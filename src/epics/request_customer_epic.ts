import {ofType} from 'redux-observable';
import {mergeMap} from 'rxjs/operators';

import * as actionTypes from '@actions/types/request_customer_type';
import {getAssetsCheckingRequests} from '@data/api';

export const getAssetCheckingRequestsData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_ASSET_CHECKING_REQUESTS),
        mergeMap((action: any) =>
            getAssetsCheckingRequests(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_ASSET_CHECKING_REQUESTS_SUCCESS,
                        message: 'Get danh sách asset checking request thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_ASSET_CHECKING_REQUESTS_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );
