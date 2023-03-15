import { GET_LIST_LOCATION_CUSTOMER } from './types/customer_location_type';

export const getListCustomerLocation =
  ({
     User_ID,
     Password,
     query,
     isFilterLatLng,
   }) => ({
    type: GET_LIST_LOCATION_CUSTOMER,
    data: {
      User_ID,
      Password,
      query,
      isFilterLatLng,
    },
  });
