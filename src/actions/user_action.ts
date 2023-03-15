import { GET_ALL_USER_RC } from './types/user_type';

export const getAllUserRC = ({ UserID, token }) => ({
  type: GET_ALL_USER_RC,
  data: {
    UserID,
    token,
  },
});
