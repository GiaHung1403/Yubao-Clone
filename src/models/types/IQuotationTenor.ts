// To parse this data:
//
//   import { Convert, IQuotationTenor } from "./file";
//
//   const iQuotationTenor = Convert.toIQuotationTenor(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IQuotationTenor {
	quo_ID: number;
	cur_c: string;
	principle: string;
	principleVAT: string;
	interest: string;
	interestVAT: string;
	rental: string;
	beginBlance: string;
	cashFlow: string;
	percentage: number;
	tenor: number;
	latePaymentPenalty: null;
	ovdInterest: null;
	paymentDate: null;
}
