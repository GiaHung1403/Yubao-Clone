import * as actionTypes from '@actions/types/dashboard_type';
import {
  timeFromFilterDashboardDefault,
  timeToFilterDashboardDefault,
} from '@data/Constants';

const initialState = {
  message: '',
  data: [],
  error: false,
  loading: true,
  dataSummaryProgress: null,
  dataNPV: null,
  dataRecovery: null,
  dataDelinquent: null,
  dataInsuranceInformed: null,
  fromDate: timeFromFilterDashboardDefault,
  toDate: timeToFilterDashboardDefault,
  idModalDate: 0,
  idChipDate: 'month',
  isViewByTeam: true,
  teamMemberSelected: null,
  subTeamSelected: null,
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case actionTypes.GET_SUMMARY_PROGRESS_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataSummaryProgress: action.response,
        loading: false,
      };
    case actionTypes.GET_SUMMARY_PROGRESS_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_NPV_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataNPV: action.response,
        loading: false,
      };
    case actionTypes.GET_NPV_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_RECOVERY_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataRecovery: action.response,
        loading: false,
      };
    case actionTypes.GET_RECOVERY_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_DELINQUENT_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataDelinquent: action.response,
        loading: false,
      };
    case actionTypes.GET_DELINQUENT_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.GET_INSURANCE_INFORMED_SUCCESS:
      return {
        ...state,
        message: action.message,
        error: false,
        dataInsuranceInformed: action.response,
        loading: false,
      };
    case actionTypes.GET_INSURANCE_INFORMED_FAIL:
      return {
        ...state,
        message: action.message,
        error: true,
        loading: false,
      };
    case actionTypes.SET_FROM_DATE:
      return {
        ...state,
        fromDate: action.data.date,
      };
    case actionTypes.SET_TO_DATE:
      return {
        ...state,
        toDate: action.data.date,
      };
    case actionTypes.SET_ID_CHIP_DATE:
      return {
        ...state,
        idChipDate: action.data.idChip,
      };
    case actionTypes.SET_ID_MODAL_DATE:
      return {
        ...state,
        idModalDate: action.data.idModal,
      };
    case actionTypes.SET_VIEW_BY_TEAM:
      return {
        ...state,
        isViewByTeam: action.data.isViewByTeam,
      };
    case actionTypes.SET_SUB_TEAM_SELECTED:
      return {
        ...state,
        subTeamSelected: action.data.subTeamSelected,
      };
    case actionTypes.SET_TEAM_MEMBER_SELECTED:
      return {
        ...state,
        teamMemberSelected: action.data.teamMemberSelected,
      };
    case actionTypes.CLEAR_FILTER:
      return initialState;
    default:
      return state;
  }
}
