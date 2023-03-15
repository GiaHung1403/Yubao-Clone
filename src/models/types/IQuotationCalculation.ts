// To parse this data:
//
//   import { Convert, IQuotationCalculation } from "./file";
//
//   const iQuotationCalculation = Convert.toIQuotationCalculation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface IQuotationCalculation {
	dblMA: number;
	dblRA: number;
	lblPMT: string;
	lblIRR: string;
	lblIRR1: string;
	lblNPV: string;
	lblNF: string;
	quoSteps: quoSteps[];
	CastFlows: CastFlow[];
}

export interface CastFlow {
  Tenor: number;
  CashFlow: number;
}

export interface quoSteps {
	tenor: number;
	cboCurC: CboCurC;
	rental: number;
	cashFlow: number;
	beginBlance: number;
	principle: number;
	principleVAT: number;
	interest: number;
	interestVAT: number;
	percentage: number;
}

export enum CboCurC {
  Vnd = "VND",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime