import { GET_LIST_INSURANCE_CONTRACT } from './types/insurance_type';

export const getInsuranceContracts = ({
	userId,
	fromDate,
	toDate,
	searchKey,
	filter,
}) => ({
	type: GET_LIST_INSURANCE_CONTRACT,
	data: {
		userId,
		fromDate,
		toDate,
		searchKey,
		filter,
	},
});
