import {
  GET_LIST_CAR_BOOKING,
} from './types/car_booking_type';

export const getListCarBooking =
  ({
     User_ID,
     Password,
     fromDate,
     toDate,
     branchID,
     carID,
     bookingID,
     subTeam,
     opEmpNO,
     lsName,
     status,
   }) => ({
    type: GET_LIST_CAR_BOOKING,
    data: {
      User_ID,
      Password,
      fromDate,
      toDate,
      branchID,
      carID,
      bookingID,
      subTeam,
      opEmpNO,
      lsName,
      status,
    },
  });
