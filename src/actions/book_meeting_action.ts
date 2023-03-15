import {
    GET_LIST_BOOK_MEETING,
    GET_LIST_ROOM
} from './types/book_meeting_type';

export const getListMeetingRoom =
    ({
         User_ID,
         Password,
         branchID
     }) => ({
        type: GET_LIST_ROOM,
        data: {
            User_ID,
            Password,
            KEY_DATA: branchID
        },
    });

export const getListBookMeeting =
    ({
         User_ID,
         Password,
         fromDate,
         toDate,
         branchID,
         roomID,
         bookingID,
         meetingContent
     }) => ({
        type: GET_LIST_BOOK_MEETING,
        data: {
            User_ID,
            Password,
            fromDate,
            toDate,
            branchID,
            roomID,
            bookingID,
            meetingContent
        },
    });
