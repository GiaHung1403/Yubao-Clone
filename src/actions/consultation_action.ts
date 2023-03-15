import {
	GET_LIST_CONSULTATION,
	SET_SELECTED_CITY,
	SET_CUSTOMER_NAME,
	SET_PROGRAM,
	SET_KIND_VEHICLE,
	SET_KIND_CREDIT_TYPE,
	SET_KIND_UNDER_COMMISSION,
	SET_KIND_CREDIT_VISIT_DATE,
	SET_VISIT_DATE,
	SET_CUSTOMER_RESOURCE,
	SET_DEALER_NAME,
	SET_KIND_FUNDING_PURPOSE,
	// SET_FUNDING_PURPOSE,
	SET_LEASED_ASSETS,
	SET_OTHER_CONDITIONS,
	SET_OPINIONS_OF_SALES_DEPT,
	SET_LIST_VALUE_CREDIT_PROGRESS,
} from './types/consultation_type';

export const getListConsultation = ({
	User_ID,
	fromDate,
	toDate,
	branch_No,
	keyID,
	cnid,
	consTP,
	ls_Nm,
	sub_Team,
	mk_Emp_No,
	cr_Team,
	cr_Emp_No,
	confirm_YN,
	status,
	ATT_READ,
}) => ({
	type: GET_LIST_CONSULTATION,
	data: {
		User_ID,
		fromDate,
		toDate,
		branch_No,
		keyID,
		cnid,
		consTP,
		ls_Nm,
		sub_Team,
		mk_Emp_No,
		cr_Team,
		cr_Emp_No,
		confirm_YN,
		status,
		ATT_READ,
	},
});

export const setCustomerName = ({ customerName } : any) => ({
	type: SET_CUSTOMER_NAME,
	data: {
		customerName,
	},
});

export const setCitySelected = ({ citySelected }: any) => ({
	type: SET_SELECTED_CITY,
	data: {
		citySelected,
	},
});

export const setProgramSelected = ({ programSelected }: any) => ({
	type: SET_PROGRAM,
	data: {
		programSelected,
	},
});

export const setVehicleYN = ({ vehicleYN }: any) => ({
	type: SET_KIND_VEHICLE,
	data: {
		vehicleYN,
	},
});

export const setCreditTypeSelected = ({ creditTypeSelected }: any) => ({
	type: SET_KIND_CREDIT_TYPE,
	data: {
		creditTypeSelected,
	},
});

export const setUnderCommissionProgram = ({ underCommissionProgram }: any) => ({
	type: SET_KIND_UNDER_COMMISSION,
	data: {
		underCommissionProgram,
	},
});

export const setCustomerSourceSelected = ({ customerSourceSelected }: any) => ({
	type: SET_CUSTOMER_RESOURCE,
	data: {
		customerSourceSelected,
	},
});

export const setDealerName = ({ dealerName }: any) => ({
	type: SET_DEALER_NAME,
	data: {
		dealerName,
	},
});

export const setFundingPurposeSelected = ({ fundingPurposeSelected }: any) => ({
	type: SET_KIND_FUNDING_PURPOSE,
	data: {
		fundingPurposeSelected,
	},
});

export const setLeasedAssets = ({ leasedAssets }: any) => ({
	type: SET_LEASED_ASSETS,
	data: {
		leasedAssets,
	},
});

export const setOtherConditions = ({ otherConditions }: any) => ({
	type: SET_OTHER_CONDITIONS,
	data: {
		otherConditions,
	},
});

export const setOpinionsOfSalesDept = ({ opinionsOfSalesDept }: any) => ({
	type: SET_OPINIONS_OF_SALES_DEPT,
	data: {
		opinionsOfSalesDept,
	},
});

export const setCreditVisitDateSelected = ({ creditVisitDateSelected }: any) => ({
	type: SET_KIND_CREDIT_VISIT_DATE,
	data: {
		creditVisitDateSelected,
	},
});

export const setVisitDate = ({ visitDate }: any) => ({
	type: SET_VISIT_DATE,
	data: {
		visitDate,
	},
});

export const setListValueCreditProgress = ({ listValueCreditProgress }: any) => ({
	type: SET_LIST_VALUE_CREDIT_PROGRESS,
	data: {
		listValueCreditProgress,
	},
});

// export const setDescriptionEFlow = ({ description }) => ({
// 	type: SET_FUNDING_PURPOSE,
// 	data: {
// 		description,
// 	},
// });
