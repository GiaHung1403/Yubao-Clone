import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Image,
	InteractionManager,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { useDispatch, useSelector } from 'react-redux';
import { Icon } from 'native-base';
import { Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { getListOrderHistory } from '@actions/e_coin_action';
import Header from '@components/Header';
import Labels from '@components/LabelPieChart';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Colors from '@config/Color';
import Color from '@config/Color';
import { IECoinOrderHistory, IUserLoginRC, IUserSystem } from '@models/types';
import { formatVND } from '@utils';

import styles from './styles';

interface IECoinReducer {
	eCoinTotal: string;
	listOrderHistory: IECoinOrderHistory[];
}

export function ECoinScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { eCoinTotal, listOrderHistory }: IECoinReducer = useSelector(
		(state: any) => state.e_coin_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
			dispatch(
				getListOrderHistory({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
				}),
			);
		});
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'E-Point'} />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<TouchableOpacity
						onPress={() => navigation.navigate('ECoinHistoryScreen')}
						style={{
							alignSelf: 'flex-end',
							paddingHorizontal: 12,
							paddingTop: 16,
							paddingBottom: 4,
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<Icon
							as={Ionicons}
							name={'time-outline'}
							size={6}
							color={Color.status}
							marginRight={4}
						/>
						<Text>History</Text>
					</TouchableOpacity>
					<PieChart
						valueAccessor={({ item }) => item.amount}
						style={{ height: 250 }}
						innerRadius={20}
						outerRadius={100}
						labelRadius={140}
						data={[
							{
								key: 1,
								amount: 100,
								svg: { fill: Colors.approved },
							},
							// {
							//     key: 2,
							//     amount: 50,
							//     svg: {fill: Colors.approved},
							// },
							// {
							//     key: 3,
							//     amount: 20,
							//     svg: {fill: Colors.waiting},
							// },
						]}
						animate={true}
					>
						<Labels />
					</PieChart>

					<Text
						style={{
							fontWeight: '600',
							color: '#3e3e3e',
							fontSize: 16,
							textAlign: 'center',
						}}
					>
						Total E-Point:{' '}
						<Text style={{ color: Color.status }}>{formatVND(eCoinTotal)}</Text>
					</Text>

					<View style={{ marginHorizontal: 8, marginTop: 4, padding: 8 }}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<View>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginBottom: 4,
									}}
								>
									<View
										style={{
											backgroundColor: Colors.approved,
											width: 12,
											height: 12,
											borderRadius: 6,
											marginRight: 8,
										}}
									/>
									<Text>Insurance Statement</Text>
								</View>
								{/*<View style={{flexDirection: "row", alignItems: "center", marginBottom: 4}}>*/}
								{/*    <View style={{*/}
								{/*        backgroundColor: Colors.approved,*/}
								{/*        width: 12,*/}
								{/*        height: 12,*/}
								{/*        borderRadius: 6,*/}
								{/*        marginRight: 8,*/}
								{/*    }}/>*/}
								{/*    <Text>Other 1</Text>*/}
								{/*</View>*/}
								{/*<View style={{flexDirection: "row", alignItems: "center"}}>*/}
								{/*    <View style={{*/}
								{/*        backgroundColor: Colors.waiting,*/}
								{/*        width: 12,*/}
								{/*        height: 12,*/}
								{/*        borderRadius: 6,*/}
								{/*        marginRight: 8,*/}
								{/*    }}/>*/}
								{/*    <Text>Other 2</Text>*/}
								{/*</View>*/}
							</View>

							{/*<Icon type={"Ionicons"} name={"chevron-forward-outline"}*/}
							{/*      style={{color: "#3e3e3e", fontSize: 24}}/>*/}
						</View>
					</View>

					<Card
						elevation={2}
						style={{ marginHorizontal: 8, marginTop: 8, padding: 8 }}
						onPress={() => navigation.navigate('ECoinCameraScreen', {})}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image
								source={{
									uri: 'https://img.icons8.com/bubbles/300/000000/gift.png',
								}}
								resizeMode={'contain'}
								style={{ width: 50, height: 50 }}
							/>
							<Text style={{ flex: 1, marginLeft: 8 }}>Redeem gifts</Text>
							<Icon
								as={Ionicons}
								name={'chevron-forward-outline'}
								size={7}
								color={'#3e3e3e'}
							/>
						</View>
					</Card>

					<Card
						elevation={2}
						style={{ marginHorizontal: 8, marginTop: 8, padding: 8 }}
						onPress={() => navigation.navigate('ECoinOrderHistoryScreen')}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image
								source={{
									uri: 'https://img.icons8.com/bubbles/300/000000/time-machine.png',
								}}
								resizeMode={'contain'}
								style={{ width: 50, height: 50 }}
							/>
							<Text style={{ flex: 1, marginLeft: 8 }}>
								Order History (
								<Text
									style={{
										color: 'red',
										fontWeight: '600',
									}}
								>
									{listOrderHistory.filter(item => item.STA !== '3').length}
								</Text>
								)
							</Text>
							<Icon
								as={Ionicons}
								name={'chevron-forward-outline'}
								size={7}
								color={'#3e3e3e'}
							/>
						</View>
					</Card>

					<Card
						elevation={2}
						style={{ marginHorizontal: 8, marginTop: 8, padding: 8 }}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image
								source={{
									uri: 'https://img.icons8.com/bubbles/300/000000/receive-cash.png',
								}}
								resizeMode={'contain'}
								style={{ width: 50, height: 50 }}
							/>
							<Text style={{ flex: 1, marginLeft: 8 }}>Send to other user</Text>
							<Icon
								as={Ionicons}
								name={'chevron-forward-outline'}
								size={7}
								color={'#3e3e3e'}
							/>
						</View>
					</Card>
				</View>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
