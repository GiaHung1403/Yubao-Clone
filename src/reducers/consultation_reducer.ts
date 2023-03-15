import * as actionTypes from '@actions/types/consultation_type';

const initialState = {
	message: '',
	listConsultation: [],
	error: false,
	loading: true,

	customerName: '',
	// masterCF: '',
	citySelected: '',
	programSelected: '',
	vehicleYN: '',
	creditTypeSelected: '',
	underCommissionProgram: '',
	customerSourceSelected: '',
	dealerName: '',
	// fundingPurposeText: '',
	fundingPurposeSelected: '',
	leasedAssets: '',
	otherConditions: '',
	opinionsOfSalesDept: '',
	// currencySelected: '',
	// paidUpCapital: '',
	// registeredCapital: '',
	// salesLastYear: '',
	// networthLastYear: '',
	// totalAsset: '',
	// profitLoss: '',
	// deptRatio: '',
	listValueCreditProgress: '',
	creditVisitDateSelected: '',
	visitDate: new Date(),
};

export default function (state = initialState, action: any) {
	switch (action.type) {
		case actionTypes.GET_LIST_CONSULTATION:
			return {
				...state,
				loading: true,
				listConsultation: [],
			};
		case actionTypes.GET_LIST_CONSULTATION_SUCCESS:
			return {
				...state,
				message: action.message,
				error: false,
				listConsultation: action.response,
				loading: false,
			};
		case actionTypes.GET_LIST_CONSULTATION_FAIL:
			return {
				...state,
				message: action.message,
				error: true,
				loading: false,
			};

		case actionTypes.SET_CUSTOMER_NAME:
			return {
				...state,
				customerName: action.data.customerName,
			};

		case actionTypes.SET_CUSTOMER_RESOURCE:
			return {
				...state,
				customerSourceSelected: action.data.customerSourceSelected,
			};

		case actionTypes.SET_DEALER_NAME:
			return {
				...state,
				dealerName: action.data.dealerName,
			};

		case actionTypes.SET_KIND_CREDIT_TYPE:
			return {
				...state,
				creditTypeSelected: action.data.creditTypeSelected,
			};

		case actionTypes.SET_KIND_CREDIT_VISIT_DATE:
			return {
				...state,
				creditVisitDateSelected: action.data.creditVisitDateSelected,
			};

		case actionTypes.SET_KIND_FUNDING_PURPOSE:
			return {
				...state,
				fundingPurposeSelected: action.data.fundingPurposeSelected,
			};
		case actionTypes.SET_KIND_UNDER_COMMISSION:
			return {
				...state,
				underCommissionProgram: action.data.underCommissionProgram,
			};

		case actionTypes.SET_KIND_VEHICLE:
			return {
				...state,
				vehicleYN: action.data.vehicleYN,
			};

		case actionTypes.SET_LEASED_ASSETS:
			return {
				...state,
				leasedAssets: action.data.leasedAssets,
			};

		case actionTypes.SET_LIST_VALUE_CREDIT_PROGRESS:
			return {
				...state,
				listValueCreditProgress: action.data.listValueCreditProgress,
			};

		case actionTypes.SET_OPINIONS_OF_SALES_DEPT:
			return {
				...state,
				opinionsOfSalesDept: action.data.opinionsOfSalesDept,
			};

		case actionTypes.SET_OTHER_CONDITIONS:
			return {
				...state,
				otherConditions: action.data.otherConditions,
			};

		case actionTypes.SET_PROGRAM:
			return {
				...state,
				programSelected: action.data.programSelected,
			};

		case actionTypes.SET_SELECTED_CITY:
			return {
				...state,
				citySelected: action.data.citySelected,
			};

		case actionTypes.SET_VISIT_DATE:
			return {
				...state,
				visitDate: action.data.visitDate,
			};

		default:
			return state;
	}
}
