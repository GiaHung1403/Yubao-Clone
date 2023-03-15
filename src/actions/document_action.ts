import { GET_LIST_FILE_RC } from './types/document_type';

export const getListFileRC = ({ token, UserID, type, roomId }) => ({
  type: GET_LIST_FILE_RC,
  data: {
    token,
    UserID,
    type,
    roomId,
  },
});
