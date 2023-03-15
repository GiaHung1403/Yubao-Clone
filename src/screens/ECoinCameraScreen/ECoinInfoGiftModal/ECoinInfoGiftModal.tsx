import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	Alert,
	Image,
	InteractionManager,
	Keyboard,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';

import {
	getECoinTotal as getECoinTotalAction,
	getListOrderHistory,
} from '@actions/e_coin_action';
import PickerCustomComponent from '@components/PickerCustomComponent';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import {
	createOrderECoin,
	getECoinTotal,
	getProductECoinDetail,
} from '@data/api';
import { getListBranch } from '@data/api';
import { IBranch, IECoinProduct, IUserSystem } from '@models/types';
import { Button, Card, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles';

interface IDataPicker {
	value: number | string;
	label: string;
}

export function ECoinInfoGiftModal(props: any) {
	const dispatch = useDispatch();
	let enableScan: boolean = true;
	const navigation: any = useNavigation();
	const { giftNo } = props.route.params;

	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [productECoin, setProductECoin] = useState<IECoinProduct>();
	const [listBranch, setListBranch] = useState<IDataPicker[]>([]);
	const [amount, setAmount] = useState<string>('1');
	const [branchSelected, setBranchSelected] = useState<string>(
		dataUserSystem?.BRANCH_CODE,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	const I18n = useContext(LocalizationContext);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);

			(async function getDataBranch() {
				const responseBranch: IBranch[] = (await getListBranch({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
				})) as IBranch[];

				const listBranchConvert: IDataPicker[] = responseBranch.map(item => ({
					label: item.STND_C_NM,
					value: item.C_NO,
				}));

				setListBranch(listBranchConvert);
			})();
		});
	}, []);

	useEffect(() => {
		(async function getDataGift() {
			const response = (await getProductECoinDetail({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				giftNo,
				branchCode: branchSelected,
			})) as IECoinProduct[];

			setProductECoin(response[0]);
			setBranchSelected(response[0].BRANCH_CODE.trim());
		})();
	}, [branchSelected]);

	const _onPressRedeem = () => {
		const totalCoinRedeem =
			parseInt(productECoin?.POINT || '1', 10) * parseInt(amount, 10);
		if (amount === '0') {
			Alert.alert('Notice', 'Amount need > 0!');
			return;
		}
		if (parseInt(amount, 10) > (productECoin?.NQTY || 0)) {
			Alert.alert('Notice', 'Not enough amount!');
			return;
		}
		Alert.alert(
			'Alert',
			`Would you like to redeem ${amount} ${productECoin?.GIFT_NM} for ${totalCoinRedeem} points?`,
			[
				{
					text: 'Yes',
					style: 'default',
					onPress: async () => {
						try {
							const totalECoin: any = await getECoinTotal({
								User_ID: dataUserSystem.EMP_NO,
								Password: '',
							});

							if (totalECoin < totalCoinRedeem) {
								Alert.alert(
									'Error',
									`You don't have enough points to redeem this gift! Your point: ${totalECoin}`,
								);
								return;
							}
							await createOrderECoin({
								User_ID: dataUserSystem.EMP_NO,
								Password: '',
								giftNo: productECoin?.GIFT_NO,
								branchCode: branchSelected,
								amount,
							});

							Alert.alert('Success', 'Redeem successful!', [
								{
									text: 'OK',
									onPress: () => {
										dispatch(
											getECoinTotalAction({
												User_ID: dataUserSystem.EMP_NO,
												Password: '',
											}),
										);
										dispatch(
											getListOrderHistory({
												User_ID: dataUserSystem.EMP_NO,
												Password: '',
											}),
										);
										enableScan = true;
										setTimeout(() => {
											navigation.goBack();
										}, 500);
									},
								},
							]);
						} catch (e: any) {
							enableScan = true;
							Alert.alert('Error', e.message);
						}
					},
				},
				{ text: 'No', style: 'cancel', onPress: () => (enableScan = true) },
			],
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			{/* View Header */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 8,
					borderBottomColor: '#ddd',
					borderBottomWidth: 1,
				}}
			>
				<Button
					uppercase={false}
					style={{}}
					onPress={() => navigation.goBack()}
				>
					Close
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					Gift Info
				</Text>
				<Button uppercase={false} style={{}} onPress={() => _onPressRedeem()}>
					{'OK'}
				</Button>
			</View>

			<Card elevation={2} style={{ padding: 8 }}>
				<View style={{ flexDirection: 'row' }}>
					<Image
						source={{
							uri: `http://124.158.8.254:9898/export/INSR_POINT/${productECoin?.IMG_URL}`,
						}}
						resizeMode={'contain'}
						style={{ width: 100, height: 100, marginRight: 8 }}
					/>
					<View style={{ justifyContent: 'space-between' }}>
						<Text
							style={{
								color: colors.primary,
								fontWeight: '600',
							}}
						>
							{productECoin?.GIFT_NM} -{' '}
							<Text
								style={{
									color: Color.status,
									fontWeight: '600',
									marginTop: 4,
								}}
							>
								{productECoin?.POINT} Point
							</Text>
						</Text>

						<PickerCustomComponent
							showLabel={true}
							listData={listBranch}
							label="Branch"
							value={branchSelected}
							textStyle={{ maxWidth: '100%' }}
							onValueChange={text => setBranchSelected(text)}
						/>
					</View>
				</View>

				<View
					style={{
						height: 1,
						width: '100%',
						backgroundColor: '#dfdfdf',
						marginVertical: 20,
					}}
				/>

				<View>
					<Text style={{ marginBottom: 8 }}>
						Quantity:{' '}
						<Text
							style={{
								color: (productECoin?.NQTY || 0) > 0 ? Color.status : 'red',
								fontWeight: '600',
							}}
						>
							{productECoin?.NQTY}
						</Text>
					</Text>

					<TextInput
						label={'Amount'}
						mode="outlined"
						value={amount}
						keyboardType={'numeric'}
						style={{ height: 40 }}
						onChangeText={text => setAmount(text)}
					/>
				</View>

				<View
					style={{
						height: 1,
						width: '100%',
						backgroundColor: '#dfdfdf',
						marginVertical: 20,
					}}
				/>

				<View>
					<Text
						style={{ textAlign: 'right', fontWeight: '600', color: '#3e3e3e' }}
					>
						Total:{' '}
						<Text style={{ color: Color.approved }}>
							{parseInt(productECoin?.POINT || '1', 10) *
								parseInt(amount, 10) || 0}
						</Text>{' '}
						Point
					</Text>
				</View>

				<View style={{ flexDirection: 'row', marginTop: 20 }}>
					<Button
						mode={'contained'}
						uppercase={false}
						onPress={_onPressRedeem}
						style={{ flex: 1 }}
					>
						Redeem
					</Button>
				</View>
			</Card>
		</View>
	);
}
