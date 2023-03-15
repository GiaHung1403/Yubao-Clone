import {ofType} from 'redux-observable';
import {mergeMap} from 'rxjs/operators';

import * as actionTypes from '@actions/types/car_booking_type';
import {getListCarBooking} from "@data/api";

export const getListCarBookingData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_LIST_CAR_BOOKING),
        mergeMap((action: any) =>
            getListCarBooking(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_LIST_CAR_BOOKING_SUCCESS,
                        message: 'Get danh sách booking car thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_LIST_CAR_BOOKING_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );
