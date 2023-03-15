import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/contact_type';
import { getListContact } from '@data/api';

export const getListContactData = (action$: any) =>
	action$.pipe(
		ofType(actionTypes.GET_LIST_CONTACT),
		mergeMap((action: any) =>
			getListContact(action.data)
				.then(async (data: any) => {
					return {
						type: actionTypes.GET_LIST_CONTACT_SUCCESS,
						message: 'Get danh sách liên hệ thành công!',
						response: { data, isFilter: action.data.isFilter },
					};
				})
				.catch((error: any) => ({
					type: actionTypes.GET_LIST_CONTACT_FAIL,
					message: error.message,
					code: error.code,
				})),
		),
	);
