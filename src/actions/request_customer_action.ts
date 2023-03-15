import {
  GET_ASSET_CHECKING_REQUESTS
} from './types/request_customer_type';

export const getAssetCheckingRequests = ({ User_ID, Password }) => ({
  type: GET_ASSET_CHECKING_REQUESTS,
  data: {
    User_ID,
    Password,
  },
});
