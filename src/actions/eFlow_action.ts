import {
  GET_LIST_APPROVER_E_FLOW,
  GET_LIST_REQUEST_E_FLOW,
  SET_DESCRIPTION_E_FLOW,
  SET_KIND_SELECTED_E_FLOW,
  SET_LESSEE_NAME_E_FLOW,
  SET_PROPOSED_BY_E_FLOW,
  SET_REQUEST_ID_E_FLOW,
  SET_STATUS_SELECTED_E_FLOW,
} from './types/eFlow_type';

export const getListRequestEFlow =
  ({
     User_ID,
     Status,
     Kind,
     RequestID,
     ProposedBy,
     LesseeName,
     Description,
   }) => ({
    type: GET_LIST_REQUEST_E_FLOW,
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

export const setKindSelectedEFlow = ({ kindSelected }) => ({
  type: SET_KIND_SELECTED_E_FLOW,
  data: {
    kindSelected,
  },
});

export const setRequestIDEFlow = ({ requestID }) => ({
  type: SET_REQUEST_ID_E_FLOW,
  data: {
    requestID,
  },
});

export const setProposedByEFlow = ({ proposedBy }) => ({
  type: SET_PROPOSED_BY_E_FLOW,
  data: {
    proposedBy,
  },
});

export const setLesseeNameEFlow = ({ lesseeName }) => ({
  type: SET_LESSEE_NAME_E_FLOW,
  data: {
    lesseeName,
  },
});

export const setDescriptionEFlow = ({ description }) => ({
  type: SET_DESCRIPTION_E_FLOW,
  data: {
    description,
  },
});

export const setStatusSelectedEFlow = ({ statusSelected }) => ({
  type: SET_STATUS_SELECTED_E_FLOW,
  data: {
    statusSelected,
  },
});

export const getListApproverEFlow = ({
	User_ID,
	KEY_DATA,
	FUNCTION_NAME,
	companyCode,
}) => ({
	type: GET_LIST_APPROVER_E_FLOW,
	data: {
		User_ID,
		KEY_DATA,
		FUNCTION_NAME,
		companyCode,
	},
});
