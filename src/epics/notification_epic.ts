import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/notification_type';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { IUserSystem } from '@models/types';

let listNotify = 0;
const getNotification = async () => {
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	let subscriberPrivate: any = null;
	let subscriberAll: any = null;
	subscriberPrivate = firestore()
		.collection('Notification')
		.doc('Private')
		.collection(`user_${dataUserSystem.EMP_NO}`)
		.onSnapshot(querySnapshot => {
			const notifications: any = [];

			querySnapshot?.forEach(documentSnapshot => {
				if (documentSnapshot.data().data.function !== 'Voting') {
					notifications.push({
						...documentSnapshot.data(),
						key: documentSnapshot.id,
					});
				}
			});

			notifications.sort((a, b) => {
				return a.create_at < b.create_at;
			});

			notifications.map(notify => Object.assign(notify, { type: 'Private' }));
			notifications.forEach(item => {
				if (!item.is_read) {
					listNotify++;
				}
			});
			// setListNotification(notifications);
		});

	subscriberAll = firestore()
		.collection('Notification')
		.doc('Notification')
		.collection('Staff')
		.where('user_store', 'array-contains-any', [
			`user_${dataUserSystem.EMP_NO.trim()}`,
			`group_${dataUserSystem.DEPT_CODE.trim()}`,
			'global',
		])
		.onSnapshot(querySnapshot => {
			const notifications: any = [];

			querySnapshot?.forEach(documentSnapshot => {
				notifications.push({
					...documentSnapshot.data(),
					key: documentSnapshot.id,
				});
			});

			notifications.sort((a, b) => {
				return a.create_at < b.create_at;
			});

			notifications.map(notify =>
				notify.read_by?.findIndex(
					id => id === `user_${dataUserSystem.EMP_NO.trim()}`,
				) > -1
					? (notify.is_read = true)
					: (notify.is_read = false),
			);
			notifications.map(notify => Object.assign(notify, { type: 'All' }));
			notifications.forEach(item => {
				if (!item.is_read) {
					listNotify++;
				}
			});
			// setListAll(notifications);
		});
	// Unsubscribe from events when no longer in use
	// return () => {
	// 	subscriberPrivate();
	// 	subscriberAll();
	// };
    return listNotify;
};

export const getNotificationNum = (action$: any) =>
	action$.pipe(
		ofType(actionTypes.SET_NUMBER_UNREAD_NOTIFICATION),
		mergeMap((action: any) =>
			getNotification()
				.then(async (data: any) => {
					return {
						type: actionTypes.GET_NUMBER_UNREAD_SUCCESS,
						message: 'Get list notification thành công!',
						response: data,
					};
				})
				.catch((error: any) => ({
					type: actionTypes.GET_NUMBER_UNREAD_FAIL,
					message: error.message,
					code: error.code,
				})),
		),
	);
