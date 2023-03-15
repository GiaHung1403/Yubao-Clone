import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/ticket_type';
import { getAllUserRC } from '@data/api';

export const getListTicket = (action$: any) =>
	action$.pipe(
		ofType(actionTypes.GET_ALL_TICKET),
		mergeMap((action: any) =>
			getAllUserRC(action.data)
				.then(async (data: any) => {
					return {
						type: actionTypes.GET_ALL_TICKET_SUCCESS,
						message: 'Get list ticket suscess!',
						response: data,
					};
				})
				.catch((error: any) => ({
					type: actionTypes.GET_ALL_TICKET_FAIL,
					message: error.message,
					code: error.code,
				})),
		),
	);
