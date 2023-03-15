import {
    GET_LIST_GENERAL_RFA,
} from './types/general_rfa_type';

export const getListGeneralRFA =
    ({
         User_ID,
         fromDate,
         toDate,
         REQ_ID,
         Subj
     }) => ({
        type: GET_LIST_GENERAL_RFA,
        data: {
            User_ID,
            fromDate,
            toDate,
            REQ_ID,
            Subj
        },
    });
