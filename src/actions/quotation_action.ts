import {
    CALCULATION_QUOTATION,
    GET_LIST_QUOTATION,
    GET_LIST_TENOR,
    GET_QUOTATION_DETAIL,
    RESET_QUOTATION_RESULT,
    SET_LIST_TENOR,
} from './types/quotation_type';

export const getListQuotation =
    ({
         FROM_DATE,
         TO_DATE,
         KEY_ID,
         LESE_ID,
         LS_NM,
         SUB_TEAM,
         MK_EMP_NO,
         CONFIRM_YN,
         BRANCH_CODE,
     }) => ({
        type: GET_LIST_QUOTATION,
        data: {
            FROM_DATE,
            TO_DATE,
            KEY_ID,
            LESE_ID,
            LS_NM,
            SUB_TEAM,
            MK_EMP_NO,
            CONFIRM_YN,
            BRANCH_CODE,
        },
    });

export const getQuotationDetail = ({QUO_ID}) => ({
    type: GET_QUOTATION_DETAIL,
    data: {
        QUO_ID,
    },
});

export const getListTenor = ({User_ID, Password, QUO_ID}) => ({
    type: GET_LIST_TENOR,
    data: {
        User_ID,
        Password,
        QUO_ID,
    },
});

export const setListTenor = ({listTenor}) => ({
    type: SET_LIST_TENOR,
    data: listTenor,
});

export const resetQuotationResult = () => ({
    type: RESET_QUOTATION_RESULT,
});

export const calculationQuotation = ({
	QuoDate,
	LEASE_P,
	PAY_MOD,
	DIS_R,
	PerType,
	ACQT_AMT,
	CALC_TP,
	DEP_AMT,
	B_RATE,
	M_RATE,
	M_RATE2,
	RV_TP,
	IRR_TYPE,
	MAN_FEE_AMT,
	RES_VAL_AMT,
	CUR_C,
	LIST_TENOR,
	OTHER_FEE,
	txtOtherFee,
}) => ({
	type: CALCULATION_QUOTATION,
	data: {
		QuoDate,
		LEASE_P,
		PAY_MOD,
		DIS_R,
		PerType,
		ACQT_AMT,
		CALC_TP,
		DEP_AMT,
		B_RATE,
		M_RATE,
		M_RATE2,
		RV_TP,
		IRR_TYPE,
		MAN_FEE_AMT,
		RES_VAL_AMT,
		CUR_C,
		LIST_TENOR,
		OTHER_FEE,
		txtOtherFee,
	},
});
