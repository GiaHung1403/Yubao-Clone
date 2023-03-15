export interface ICustomerLocation {
	// ADDR: string;
	// ADDR_V: string;
	// FLAT_LONG: string;
	// LESE_ID: number;
	// LS_NM: string;
	// LS_NM_V: string;
	// OB: number;
	// TAX_CODE: string;
	// location: ILocation;
	// DEALER_YN: string;

	lese_ID: number;
	ls_nm: string;
	addr_v: string;
	addr: string;
	ls_nm_v: string;
	tax_code: string;
	flat_long: string;
	dealeR_YN: string;
	tempPOB: number;
	location: ILocation;
	ob: boolean;
}

export interface ILocation {
	latitude: number;
	longitude: number;
}
