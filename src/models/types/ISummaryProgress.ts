// To parse this data:
//
//   import { Convert, ISummaryProgress } from "./file";
//
//   const iSummaryProgress = Convert.toISummaryProgress(json);
//
// These functions will throw an error if the JSON doesnt
// match the expected interface, even if the JSON is valid.

export interface ISummaryProgress {
	// ACML_AMT:               number;
	// ACML_TARGET:            number;
	// ACML_TARGET_CONS:       number;
	// ACML_TARGET_TELE:       number;
	// ACML_TARGET_VISIT:      number;
	// NO_CONS:                number;
	// NO_TELE:                number;
	// NO_VISIT:               number;
	// NPV_AMT:                number;
	// NPV_TARGET:             number;
	// ACML_TEAM_TARGET:       number;
	// NO_VISIT1:              number;
	// PERSENT_ACML_TARGET:    number;
	// PERSENT_CONS:           number;
	// PERSENT_NPV:            number;
	// PERSENT_TELE:           number;
	// PERSENT_VISIT:          number;

	acml_target: number;
	acml_team_target: number;
	acml_amt: number;
	npv_amt: number;
	persent_acml_target: number;
	persent_npv: number;
	acml_target_visit: number;
	no_visit: number;
	persent_visit: number;
	acml_target_tele: number;
	no_tele: number;
	persent_tele: number;
	acml_target_cons: number;
	no_cons: number;
	persent_cons: number;
	npV_Target: number;
}
