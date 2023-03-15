import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/insurance_type';
import { getListInsuranceContract } from '@data/api';

export const getInsuranceContracts = (action$: any) =>
	action$.pipe(
		ofType(actionTypes.GET_LIST_INSURANCE_CONTRACT),
		mergeMap((action: any) =>
			getListInsuranceContract(action.data)
				.then(async (data: any) => {
					return {
						type: actionTypes.GET_LIST_INSURANCE_CONTRACT_SUCCESS,
						message: 'Get danh sách hợp đồng bảo hiểm thành công!',
						response: data,
					};
				})
				.catch((error: any) => ({
					type: actionTypes.GET_LIST_INSURANCE_CONTRACT_FAIL,
					message: error.message,
					code: error.code,
				})),
		),
	);
