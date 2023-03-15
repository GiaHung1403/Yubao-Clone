import * as actionTypes from '@actions/types/book_meeting_type';

const initialState = {
    message: '',
    listMeetingRoom: [],
    listBookMeeting: [],
    error: false,
    loading: true,
};

export default function (state = initialState, action: any) {
    switch (action.type) {
        case actionTypes.GET_LIST_ROOM:
            return {
                ...state,
                loading: true,
                listMeetingRoom: [],
            };
        case actionTypes.GET_LIST_ROOM_SUCCESS:
            return {
                ...state,
                message: action.message,
                error: false,
                listMeetingRoom: action.response,
                loading: false,
            };
        case actionTypes.GET_LIST_ROOM_FAIL:
            return {
                ...state,
                message: action.message,
                error: true,
                loading: false,
            };
        case actionTypes.GET_LIST_BOOK_MEETING:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.GET_LIST_BOOK_MEETING_SUCCESS:
            return {
                ...state,
                message: action.message,
                error: false,
                listBookMeeting: action.response,
                loading: false,
            };
        case actionTypes.GET_LIST_BOOK_MEETING_FAIL:
            return {
                ...state,
                message: action.message,
                error: true,
                loading: false,
            };
        default:
            return state;
    }
}
