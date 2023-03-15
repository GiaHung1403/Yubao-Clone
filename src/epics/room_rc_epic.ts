import { ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

import * as actionTypes from '@actions/types/room_rc_type';
import { getListRoomMemberRC, getListRequests } from '@data/api';
import mergeSubscriptionsRooms from '@data/helpers/mergeSubscriptionsRooms';
import { RocketChat } from '@data/rocketchat';

export const getListDataRoomMember = (action$: any) =>
	action$.pipe(
		ofType(actionTypes.GET_LIST_ROOM_MEMBER_RC),
		mergeMap((action: any) =>
			getListRoomMemberRC(action.data)
				.then(async (data: any) => {
					return {
						type: actionTypes.GET_LIST_ROOM_MEMBER_RC_SUCCESS,
						message: 'Get danh sach room member RC thành công!',
						response: data,
					};
				})
				.catch((error: any) => ({
					type: actionTypes.GET_LIST_ROOM_MEMBER_RC_FAIL,
					message: error.message,
					code: error.code,
				})),
		),
	);

export const getListDataRoom = (action$: any) =>
	action$.pipe(
		ofType(actionTypes.GET_LIST_ROOM_RC),
		mergeMap((action: any) =>
			RocketChat.getRooms()
				.then(async (data: any) => {
					const [subscriptionsResult, roomsResult] = data;
					// console.log([subscriptionsResult.update, roomsResult.update]);
					const { subscriptions } = await mergeSubscriptionsRooms(
						subscriptionsResult,
						roomsResult,
					);
					const roomFilter = subscriptions;

					return {
						type: actionTypes.GET_LIST_ROOM_RC_SUCCESS,
						message: 'Get danh sách room RC thành công!',
						response: roomFilter,
					};
				})
				.catch((error: any) => {
					return {
						type: actionTypes.GET_LIST_ROOM_RC_FAIL,
						message: error.message,
						code: error.code,
					};
				}),
		),
	);

	export const getListRequest = (action$: any) =>
		action$.pipe(
			ofType(actionTypes.GET_LIST_REQUEST),
			mergeMap((action: any) =>
				getListRequests(action.data)
					.then(async (data: any) => {
						return {
							type: actionTypes.GET_LIST_REQUEST_SUCCESS,
							message: 'Get danh sach room Reuqest thành công!',
							response: data,
						};
					})
					.catch((error: any) => ({
						type: actionTypes.GET_LIST_REQUEST_FAIL,
						message: error.message,
						code: error.code,
					})),
			),
		);

