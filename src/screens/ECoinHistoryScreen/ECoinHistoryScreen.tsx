import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, InteractionManager, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListECoinReport } from '@actions/e_coin_action';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';
import { IECoinHistory, IUserSystem } from '@models/types';
import { convertUnixTimeFull } from '@utils';
import styles from './styles';

export function ECoinHistoryScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const listECoinReport: IECoinHistory[] = useSelector(
		(state: any) => state.e_coin_reducer.listECoinReport,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
			dispatch(
				getListECoinReport({
					User_ID: dataUserSystem.EMP_NO,
					orderID: '',
					fromDate: moment().startOf('year').format('DDMMYYYY'),
					toDate: moment().format('DDMMYYYY'),
					type: '',
				}),
			);
		});
	}, []);


	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'E-Point History'} />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={listECoinReport}
						style={{ padding: 8 }}
						keyExtractor={(_, index) => index.toString()}
						renderItem={({ item, index }) => (
							<Card elevation={2} style={{ marginBottom: 8 }}>
								<View
									style={{
										flexDirection: 'row',
										flex: 1,
										padding: 8,
										alignItems: 'center',
									}}
								>
									<Image
										source={{
											uri:
												item.type === '1'
													? 'https://img.icons8.com/bubbles/300/000000/wallet-app.png'
													: 'https://img.icons8.com/bubbles/300/000000/buy.png',
										}}
										resizeMode={'contain'}
										style={{ width: 60, height: 60 }}
									/>

									<View style={{ flex: 1, marginHorizontal: 8 }}>
										<Text
											style={{
												color: item.type === '1' ? Color.approved : 'red',
												fontSize: 16,
												fontWeight: '600',
											}}
										>
											{`${item.type === '1' ? '+' : '-'} ${item.point}`}
										</Text>
										<Text style={{ marginTop: 4 }}>
											{item.content.replace(/(<([^>]+)>)/gi, '')}
										</Text>
										<Text
											style={{
												marginTop: 4,
												textAlign: 'right',
												color: '#555',
											}}
										>
											{convertUnixTimeFull(
												new Date(item.lst_Updt_Date).getTime() / 1000,
											)}
										</Text>
									</View>
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
