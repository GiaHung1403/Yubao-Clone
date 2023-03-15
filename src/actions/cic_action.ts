import {
    GET_LIST_CIC,
} from './types/cic_type';

export const getListCIC =
    ({
         User_ID,
         Password,
         fromDate,
         toDate,
     }) => ({
        type: GET_LIST_CIC,
        data: {
            User_ID,
            Password,
            fromDate,
            toDate,
        },
    });
