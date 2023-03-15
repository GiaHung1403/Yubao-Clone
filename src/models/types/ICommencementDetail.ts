export interface ICommencementDetail {
	// APNO: string;
	// BAS_INT_R: number;
	// CUR_C: string;
	// EXP_IRR_COSTDOWN: string;
	// EXP_NPV_COSTDOWN: number;
	// FINAL: boolean;
	// FS_EMP_NM: string;
	// LS_NM: string;
	// TOTAL: string;
	// adj_dis_r: string;
	// adj_int_r: number;
	// dsbt_amt: number;
	// DSBT_DATE: string;

	apno: string;
	ls_nm: string;
	cur_c: string;
	dsbt_amt: number;
	bas_Int_r: number;
	exp_Irr_Costdown: string;
	exp_NPV_Costdown: number;
	fs_Emp_Nm: string;
	final: boolean;
	adj_dis_r: string;
	adj_int_r: number;
	total: string;
	dsbt_Date: string;
}
