import {ofType} from 'redux-observable';
import {mergeMap} from 'rxjs/operators';

import * as actionTypes from '@actions/types/book_meeting_type';
import {getListBookMeeting, getListMeetingRoom} from "@data/api";

export const getListMeetingRoomData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_LIST_ROOM),
        mergeMap((action: any) =>
            getListMeetingRoom(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_LIST_ROOM_SUCCESS,
                        message: 'Get danh sách meeting room thành công!',
                        response: data.map(item => ({
                            label: item.STND_C_NM,
                            value: item.C_NO.toString(),
                        })),
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_LIST_ROOM_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );

export const getListBookMeetingData = (action$: any) =>
    action$.pipe(
        ofType(actionTypes.GET_LIST_BOOK_MEETING),
        mergeMap((action: any) =>
            getListBookMeeting(action.data)
                .then(async (data: any) => {
                    return {
                        type: actionTypes.GET_LIST_BOOK_MEETING_SUCCESS,
                        message: 'Get danh sách book meeting thành công!',
                        response: data,
                    };
                })
                .catch((error: any) => ({
                    type: actionTypes.GET_LIST_BOOK_MEETING_FAIL,
                    message: error.message,
                    code: error.code,
                })),
        ),
    );
