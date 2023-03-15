import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/contract_timeline_type';
import { getListContract_TimeLine } from '@data/api';

export const getListContract_Timeline = (action$: any) =>
	action$.pipe(
		ofType(actionTypes.GET_LIST_CONTRACT_TIMELINE),
		mergeMap((action: any) =>
			getListContract_TimeLine(action.data)
				.then(async (data: any) => {
					return {
						type: actionTypes.GET_LIST_CONTRACT_TIMELINE_SUCCESS,
						message: 'Get hợp đồng thành công!',
						response: data,
					};
				})
				.catch((error: any) => ({
					type: actionTypes.GET_LIST_CONTRACT_TIMELINE_FAIL,
					message: error.message,
					code: error.code,
				})),
		),
	);
