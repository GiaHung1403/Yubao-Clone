import { GET_LIST_CUSTOMER, GET_LIST_SELLER } from './types/customer_type';

interface IParamGetListCustomer {
  User_ID: string,
  Password: string,
  query: string,
  refresh?: boolean,
}

export const getListCustomer =
  ({
     User_ID,
     Password,
     query,
     refresh,
   }: IParamGetListCustomer) => ({
    type: GET_LIST_CUSTOMER,
    data: {
      User_ID,
      Password,
      query,
      refresh,
    },
  });

export const getListSeller =
  ({
     User_ID,
     Password,
     query,
     refresh,
   }: IParamGetListCustomer) => ({
    type: GET_LIST_SELLER,
    data: {
      User_ID,
      Password,
      query,
      refresh,
    },
  });
