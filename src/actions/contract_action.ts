import {
  GET_LIST_CONTRACT,
  RESET_LIST_DEPT_AMOUNT_USD,
  RESET_LIST_DEPT_AMOUNT_VND,
  SET_LIST_DEPT_AMOUNT_USD,
  SET_LIST_DEPT_AMOUNT_VND,
} from './types/contract_type';

export const getListContract = ({ User_ID, Password, taxCode }) => ({
  type: GET_LIST_CONTRACT,
  data: {
    User_ID,
    Password,
    taxCode
  },
});

export const setListDeptAmountVND = ({ deptAmount }) => ({
  type: SET_LIST_DEPT_AMOUNT_VND,
  response: deptAmount,
});

export const resetListDeptAmountVND = () => ({
  type: RESET_LIST_DEPT_AMOUNT_VND,
});

export const setListDeptAmountUSD = ({ deptAmount }) => ({
  type: SET_LIST_DEPT_AMOUNT_USD,
  response: deptAmount,
});

export const resetListDeptAmountUSD = () => ({
  type: RESET_LIST_DEPT_AMOUNT_USD,
});
