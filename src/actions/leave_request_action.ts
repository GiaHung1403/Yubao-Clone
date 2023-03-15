import {
  GET_LIST_DAY_OFF_REMAINING,
  GET_LIST_LEAVE_REQUEST,
} from './types/leave_request_type';

export const getListLeaveRequest =
  ({
     UserID, memberID, fromDate, toDate,
   }) => ({
    type: GET_LIST_LEAVE_REQUEST,
    data: {
      UserID, memberID, fromDate, toDate,
    },
  });

export const getListDayOffRemaining = ({ UserID, fromDate, toDate }) => ({
  type: GET_LIST_DAY_OFF_REMAINING,
  data: {
    UserID, fromDate, toDate,
  },
});
