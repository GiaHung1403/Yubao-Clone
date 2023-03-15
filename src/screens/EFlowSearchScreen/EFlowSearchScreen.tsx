import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import FlatListWithHeaderCustom from '@components/FlatListWithHeaderCustom';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import RenderHTMLComponent from '@components/RenderHTMLComponent';
import Colors from '@config/Color';
import { IRequestEFlow } from '@models/types';
import moment from 'moment';
import EFlowFilterComponent from './EFlowFilterComponent';
import styles from './styles';

interface IEFlowReducer {
	listRequestEFlow: IRequestEFlow[];
	listRequestEReview: IRequestEFlow[];
	kindSelected: string;
	requestID: string;
	proposedBy: string;
	lesseeName: string;
	description: string;
	statusSelected: string;
	loading: boolean;
}

export function EFlowSearchScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const { listRequestEFlow, loading }: IEFlowReducer = useSelector(
		(state: any) => state.eFlow_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressItem = item => {
		navigation.navigate('EFlowDetailScreen', {
			eFlowItem: item,
		});
	};

	const getColorStatus = (status: string) => {
		switch (status) {
			case 'Waiting Approval':
				return Colors.waiting;
			case 'Reject':
				return Colors.reject;
			case 'Approved':
				return Colors.approved;
			default:
				break;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'E-Flow'} />
			</View>

			<FlatListWithHeaderCustom
				loading={loading}
				data={listRequestEFlow}
				showsVerticalScrollIndicator={false}
				HeaderOutList={() => (
					<View style={{ zIndex: 1, paddingTop: 8 }}>
						<EFlowFilterComponent />
					</View>
				)}
				ListHeaderComponent={() => (
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Icon
							as={Ionicons}
							name={'chatbubble-ellipses-outline'}
							size={5}
							marginRight={1}
							color={'#777'}
						/>
						<Text
							style={{
								marginVertical: 8,
								color: '#777',
								fontStyle: 'italic',
								fontSize: 11,
								fontWeight: '500',
							}}
						>
							Yubao just show last 45 days data
						</Text>
					</View>
				)}
				renderItem={({ item }) => (
					<Card
						style={{
							marginBottom: 8,
							backgroundColor: item.totaL_CNFM === '1' ? '#EEE4F4' : 'white',
						}}
						onPress={() => _onPressItem(item)}
					>
						<View style={{ padding: 12 }}>
							<Text
								style={{
									color: colors.primary,
									fontSize: 14,
									fontWeight: '500',
									marginBottom: 8,
								}}
							>
								({item.companyCode}) {item.functioN_NAME}
								{' - '}
								<Text style={{ fontWeight: '600', fontSize: 16 }}>
									{item.keY_ID}
								</Text>
								{item.pic ? ` - ${item.pic}` : ''}
							</Text>
							{item.rmks ? <RenderHTMLComponent value={item.rmks} /> : null}

							<View style={{ flexDirection: 'row', marginTop: 8 }}>
								<Text
									style={{
										flex: 1,
										fontWeight: '400',
										fontSize: 13,
									}}
								>
									{moment(item.date).format('DD/MM/YYYY')}
								</Text>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										alignSelf: 'flex-end',
									}}
								>
									{item.functioN_NAME === 'PCR' ? (
										<RenderHTMLComponent value={item.status} />
									) : (
										<Text style={{ fontSize: 13 }}>{item.status}</Text>
									)}

									<View
										style={{
											width: 12,
											height: 12,
											borderRadius: 6,
											backgroundColor: getColorStatus(item.status),
											marginLeft: 4,
										}}
									/>
								</View>
							</View>
						</View>
					</Card>
				)}
			/>
			{/* <View
				style={{
					flex: 1,
					paddingHorizontal: 8,
					paddingTop: 8,
				}}
			>
				{!loading ? (
					<FlatList
						style={{ paddingTop: 8, flex: 1 }}
						data={listRequestEFlow}
						showsVerticalScrollIndicator={false}
						keyExtractor={(_, index) => index.toString()}
						ListHeaderComponent={() => (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Icon
									as={Ionicons}
									name={'chatbubble-ellipses-outline'}
									size={6}
									marginRight={4}
									color={'#777'}
								/>
								<Text
									style={{
										marginVertical: 8,
										color: '#777',
										fontStyle: 'italic',
										fontSize: 12,
										fontWeight: '500',
									}}
								>
									Yubao just show last 45 days data
								</Text>
							</View>
						)}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<Card
								style={{
									marginBottom: 8,
									backgroundColor:
										item.totaL_CNFM === '1' ? '#EEE4F4' : 'white',
								}}
								onPress={() => _onPressItem(item)}
							>
								<View style={{ padding: 12 }}>
									<Text
										style={{
											color: colors.primary,
											fontSize: 14,
											fontWeight: '500',
											marginBottom: 8,
										}}
									>
										({item.companyCode}) {item.functioN_NAME}
										{' - '}
										<Text style={{ fontWeight: '600', fontSize: 16 }}>
											{item.keY_ID}
										</Text>
										{item.pic ? ` - ${item.pic}` : ''}
									</Text>
									{item.rmks ? <RenderHTMLComponent value={item.rmks} /> : null}

									<View style={{ flexDirection: 'row', marginTop: 8 }}>
										<Text
											style={{
												flex: 1,
												fontWeight: '400',
												fontSize: 13,
											}}
										>
											{moment(item.date).format('DD/MM/YYYY')}
										</Text>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												alignSelf: 'flex-end',
											}}
										>
											{item.functioN_NAME === 'PCR' ? (
												<RenderHTMLComponent value={item.status} />
											) : (
												<Text style={{ fontSize: 13 }}>{item.status}</Text>
											)}

											<View
												style={{
													width: 12,
													height: 12,
													borderRadius: 6,
													backgroundColor: getColorStatus(item.status),
													marginLeft: 4,
												}}
											/>
										</View>
									</View>
								</View>
							</Card>
						)}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View> */}
		</View>
	);
}
