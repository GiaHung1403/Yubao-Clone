import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getListDayOffRemaining } from '@actions/leave_request_action';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';
import { IDayOffRemaining, IUserSystem } from '@models/types';
import styles from './styles';

interface IPropLeaveReducer {
	listDayOffRemaining: IDayOffRemaining[];
	loading: boolean;
}

const nowDate = new Date();
const fromDate = new Date(nowDate.getFullYear(), 0, 1);

export function LeaveRequestRemainingScreen(props: any) {
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { listDayOffRemaining, loading }: IPropLeaveReducer = useSelector(
		(state: any) => state.leave_request_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(
				getListDayOffRemaining({
					UserID: dataUserSystem.EMP_NO,
					fromDate: moment(fromDate).format('DDMMYYYY'),
					toDate: moment(nowDate).format('DDMMYYYY'),
				}),
			);

			setDoneLoadAnimated(true);
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Day-off remaining'} />

			{doneLoadAnimated && !loading ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={listDayOffRemaining}
						keyExtractor={(_, index) => index.toString()}
						style={{ padding: 8 }}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<Card elevation={2} style={{ marginBottom: 8 }}>
								<View style={{ padding: 8 }}>
									<Text
										style={{
											fontSize: 15,
											fontWeight: '500',
											color: colors.primary,
											marginBottom: 8,
										}}
									>
										{item.c_No} - {item.stnD_C_NM}
									</Text>
									<Text style={{ marginBottom: 8 }}>
										{item.stnD_C_NM_V.trim()}
									</Text>
									<Text
										style={{
											fontWeight: 'bold',
											color: item.reMain ? Color.approved : 'red',
										}}
									>
										{item.reMain || '0d'}
									</Text>
								</View>
							</Card>
						)}
					/>
				</View>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
