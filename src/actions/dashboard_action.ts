import {
  CLEAR_FILTER,
  GET_DELINQUENT,
  GET_INSURANCE_INFORMED,
  GET_NPV,
  GET_RECOVERY,
  GET_SUMMARY_PROGRESS,
  SET_FROM_DATE,
  SET_ID_CHIP_DATE,
  SET_ID_MODAL_DATE,
  SET_SUB_TEAM_SELECTED,
  SET_TEAM_MEMBER_SELECTED,
  SET_TO_DATE,
  SET_VIEW_BY_TEAM,
} from './types/dashboard_type';

export const getSummaryProgress =
  ({
     User_ID,
     Password,
     MO_ID,
     FROM_DATE,
     TO_DATE,
     Sub_Team,
     LEVEL_TP,
   }) => ({
    type: GET_SUMMARY_PROGRESS,
    data: {
      User_ID,
      Password,
      MO_ID,
      FROM_DATE,
      TO_DATE,
      Sub_Team,
      LEVEL_TP,
    },
  });

export const getNPV =
  ({
     User_ID,
     Password,
     MO_ID,
     FROM_DATE,
     TO_DATE,
     Sub_Team,
     LEVEL_TP,
   }) => ({
    type: GET_NPV,
    data: {
      User_ID,
      Password,
      MO_ID,
      FROM_DATE,
      TO_DATE,
      Sub_Team,
      LEVEL_TP,
    },
  });

export const getRecovery =
  ({
     User_ID,
     Password,
     MO_ID,
     FROM_DATE,
     TO_DATE,
     Sub_Team,
   }) => ({
    type: GET_RECOVERY,
    data: {
      User_ID,
      Password,
      MO_ID,
      FROM_DATE,
      TO_DATE,
      Sub_Team,
    },
  });

export const getDelinquent =
  ({
     User_ID,
     Password,
     MO_ID,
     FROM_DATE,
     TO_DATE,
     Sub_Team,
   }) => ({
    type: GET_DELINQUENT,
    data: {
      User_ID,
      Password,
      MO_ID,
      FROM_DATE,
      TO_DATE,
      Sub_Team,
    },
  });

export const getInsuranceInformed =
  ({
     User_ID,
     Password,
     MO_ID,
     FROM_DATE,
     TO_DATE,
     Sub_Team,
   }) => ({
    type: GET_INSURANCE_INFORMED,
    data: {
      User_ID,
      Password,
      MO_ID,
      FROM_DATE,
      TO_DATE,
      Sub_Team,
    },
  });

export const setFromDate = ({ date }) => ({
  type: SET_FROM_DATE,
  data: {
    date,
  },
});

export const setToDate = ({ date }) => ({
  type: SET_TO_DATE,
  data: {
    date,
  },
});

export const setIDChipDate = ({ idChip }) => ({
  type: SET_ID_CHIP_DATE,
  data: {
    idChip,
  },
});

export const setIdModalDate = ({ idModal }) => ({
  type: SET_ID_MODAL_DATE,
  data: {
    idModal,
  },
});

export const setHasViewByTeam = ({ isViewByTeam }) => ({
  type: SET_VIEW_BY_TEAM,
  data: {
    isViewByTeam,
  },
});

export const setSubTeamSelected = ({ subTeamSelected }) => ({
  type: SET_SUB_TEAM_SELECTED,
  data: {
    subTeamSelected,
  },
});

export const setTeamMemberSelected = ({ teamMemberSelected }) => ({
  type: SET_TEAM_MEMBER_SELECTED,
  data: {
    teamMemberSelected,
  },
});

export const clearFilter = () => ({
  type: CLEAR_FILTER,
});
