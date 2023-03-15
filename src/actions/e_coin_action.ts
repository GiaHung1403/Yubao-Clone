import {
	GET_E_COIN_TOTAL,
	GET_LIST_E_COIN_REPORT,
	GET_LIST_ORDER_HISTORY,
} from './types/e_coin_type';

export const getListECoinReport = ({
	User_ID,
	orderID,
	fromDate,
	toDate,
	type,
}) => ({
	type: GET_LIST_E_COIN_REPORT,
	data: {
		User_ID,
		orderID,
		fromDate,
		toDate,
		type,
	},
});

export const getECoinTotal = ({ User_ID }) => ({
	type: GET_E_COIN_TOTAL,
	data: {
		User_ID,
	},
});

export const getListOrderHistory = ({ User_ID, Password }) => ({
	type: GET_LIST_ORDER_HISTORY,
	data: {
		User_ID,
		Password,
	},
});
