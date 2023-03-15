import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	Image,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListOrderHistory } from '@actions/e_coin_action';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';
import Colors from '@config/Color';
import { IECoinOrderHistory, IUserSystem } from '@models/types';
import { updateOrderECoin } from '@data/api';

import styles from './styles';

export function ECoinOrderHistoryScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();

	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const listOrderHistory: IECoinOrderHistory[] = useSelector(
		(state: any) => state.e_coin_reducer.listOrderHistory,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
			getDataListReport();
		});
	}, []);



	const getDataListReport = () => {
		dispatch(
			getListOrderHistory({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			}),
		);
	};

	const getColorStatus = (status: string) => {
		switch (status) {
			case '5':
				return Colors.draft;
			case '2':
				return Colors.waiting;
			case '4':
				return Colors.reject;
			case '9':
				return Colors.approved;
			case '12':
				return Colors.reject;
			default:
				return Colors.background;
		}
	};

	const _onPressCancel = async (item: IECoinOrderHistory) => {
		try {
			await updateOrderECoin({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				orderID: item.ORDER_ID,
			});

			Alert.alert('Success', 'Cancel Success!', [
				{ text: 'OK', onPress: () => getDataListReport() },
			]);
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'E-Point History'} />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={listOrderHistory}
						style={{ padding: 8 }}
						keyExtractor={(_, index) => index.toString()}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
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
											uri: 'https://img.icons8.com/bubbles/300/000000/gift.png',
										}}
										resizeMode={'contain'}
										style={{ width: 60, height: 60 }}
									/>
									<View style={{ marginLeft: 8, flex: 1 }}>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												marginBottom: 8,
											}}
										>
											<Text
												style={{
													color: colors.primary,
													fontSize: 16,
													fontWeight: '600',
												}}
											>
												{item.GIFT_NM}
											</Text>
											<View
												style={{ flexDirection: 'row', alignItems: 'center' }}
											>
												<Text
													style={{
														fontWeight: '500',
														color: getColorStatus(item.STA.trim()),
													}}
												>
													{item.STA_NM}
												</Text>
												<View
													style={{
														width: 10,
														height: 10,
														borderRadius: 6,
														backgroundColor: getColorStatus(item.STA.trim()),
														marginLeft: 4,
													}}
												/>
											</View>
										</View>

										<Text
											style={{
												color: Color.status,
												fontSize: 16,
												fontWeight: '600',
												marginBottom: 8,
											}}
										>
											{item.POINT} Point
										</Text>
										<View style={{ flexDirection: 'row' }}>
											<Text style={{ textAlign: 'left', flex: 1 }}>
												{item.CREATE_DATE}
											</Text>
											{item.STA.trim() === '5' ? (
												<Button
													mode={'contained'}
													uppercase={false}
													style={{ backgroundColor: 'red' }}
													onPress={() =>
														Alert.alert(
															'Alert',
															'Are you sure you want to cancel this order?',
															[
																{
																	text: 'Yes',
																	onPress: () => _onPressCancel(item),
																},
																{ text: 'No', style: 'cancel' },
															],
														)
													}
												>
													Cancel
												</Button>
											) : null}
										</View>
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
