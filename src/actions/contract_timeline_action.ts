import { GET_LIST_CONTRACT_TIMELINE } from './types/contract_timeline_type';

export const getListContract_Timeline = ({
	emp_No,
	s_Start_Date,
	s_End_Date,
	cnid,
	apno,
	customerName,
}) => ({
	type: GET_LIST_CONTRACT_TIMELINE,
	data: {
		emp_No,
		s_Start_Date,
		s_End_Date,
		cnid,
		apno,
		customerName,
	},
});
