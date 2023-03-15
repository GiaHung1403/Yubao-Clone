import * as actionTypes from '@actions/types/car_booking_type';

const initialState = {
  message: '',
  listCarBooking: [],
  error: false,
  loading: true,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_LIST_CAR_BOOKING:
      return {
        ...state,
        loading: true,
        listCarBooking: [],
      };
    case actionTypes.GET_LIST_CAR_BOOKING_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        listCarBooking: action.response,
        loading: false,
      };
    case actionTypes.GET_LIST_CAR_BOOKING_FAIL:
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
