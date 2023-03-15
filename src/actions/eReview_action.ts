import {
  GET_LIST_COMMENT_E_REVIEW,
  GET_LIST_REQUEST_E_REVIEW,
  SET_DESCRIPTION_E_REVIEW,
  SET_KIND_SELECTED_E_REVIEW,
  SET_LESSEE_NAME_E_REVIEW,
  SET_PROPOSED_BY_E_REVIEW,
  SET_REQUEST_ID_E_REVIEW,
  SET_STATUS_SELECTED_E_REVIEW,
} from './types/eReview_type';

export const getListRequestEReview =
  ({
     User_ID,
     Status,
     Kind,
     RequestID,
     ProposedBy,
     LesseeName,
     Description,
   }) => ({
    type: GET_LIST_REQUEST_E_REVIEW,
    data: {
      User_ID,
      Status,
      Kind,
      RequestID,
      ProposedBy,
      LesseeName,
      Description,
    },
  });

export const setKindSelectedEReview = ({ kindSelected }) => ({
  type: SET_KIND_SELECTED_E_REVIEW,
  data: {
    kindSelected,
  },
});

export const setRequestIDEReview= ({ requestID }) => ({
  type: SET_REQUEST_ID_E_REVIEW,
  data: {
    requestID,
  },
});

export const setProposedByEReview = ({ proposedBy }) => ({
  type: SET_PROPOSED_BY_E_REVIEW,
  data: {
    proposedBy,
  },
});

export const setLesseeNameEReview = ({ lesseeName }) => ({
  type: SET_LESSEE_NAME_E_REVIEW,
  data: {
    lesseeName,
  },
});

export const setDescriptionEReview = ({ description }) => ({
  type: SET_DESCRIPTION_E_REVIEW,
  data: {
    description,
  },
});

export const setStatusSelectedEReview = ({ statusSelected }) => ({
  type: SET_STATUS_SELECTED_E_REVIEW,
  data: {
    statusSelected,
  },
});

export const getListCommentEReview =
  ({
     User_ID,
     KEY_DATA,
     FUNCTION_NAME,
     companyCode
   }) => ({
    type: GET_LIST_COMMENT_E_REVIEW,
    data: {
      User_ID,
      KEY_DATA,
      FUNCTION_NAME,
      companyCode
    },
  });
