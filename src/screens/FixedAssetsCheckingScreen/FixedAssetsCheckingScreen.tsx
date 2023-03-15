import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from 'react-native';
import { Button, Card, FAB, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { clearListAssetScan } from '@actions/fixed_assets_action';
import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import {
	getListCategoryAssets,
	getListFixedAsset,
	getListLocationAssets,
	getListWarehouseAssets,
} from '@data/api';
import { IUserSystem } from '@models/types';
import moment from 'moment';

interface IDataPicker {
	value: number | string;
	label: string;
}

export function FixedAssetsCheckingScreen(props) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const listScanAsset = useSelector(
		(state: any) => state.fixed_assets_reducer.listScanAsset,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [listLocation, setListLocation] = useState([]);
	const [locationSelected, setLocationSelected] = useState('');
	const [listWareHouse, setListWarehouse] = useState<IDataPicker[]>([]);
	const [warehouseSelected, setWarehouseSelected] = useState<string>('-1');
	const [listCategory, setListCategory] = useState([]);
	const [categorySelected, setCategorySelected] = useState('');
	const [totalAsset, setTotalAsset] = useState(0);
	const [isStart, setIsStart] = useState<boolean>(false);

	const [listUnScanAsset, setListUnScanAsset] = useState(listScanAsset);
	const [isStop, setIsStop] = useState(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			try {
				await getDataLocation();
				await getDataCategory();
				await getDataWareHouse();
			} catch (e: any) {
				Alert.alert('Error', e.message);
			}
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		(async function getData() {
			const listFixed = (await getListFixedAsset({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				AssetCode: '',
				LocationCode: locationSelected,
				BranchCode: warehouseSelected,
			})) as any[];
			setTotalAsset(listFixed.length);
			setListUnScanAsset(listFixed);
		})();
	}, [locationSelected, warehouseSelected]);

	const getDataWareHouse = async () => {
		const responseWarehouse: any = await getListWarehouseAssets({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		});

		const listWarehouseConvert: IDataPicker[] = responseWarehouse.map(item => ({
			label: item.STND_C_NM,
			value: item.C_NO,
		}));

		setListWarehouse(listWarehouseConvert);
	};

	const getDataLocation = async () => {
		const responseLocation: any = await getListLocationAssets({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		});
		const locationConvert = responseLocation.map(item => ({
			label: item.STND_C_NM,
			value: item.C_NO,
		}));

		setListLocation(locationConvert);
	};

	const getDataCategory = async () => {
		const responseCategory: any = await getListCategoryAssets({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		});
		const CategoryConvert = responseCategory.map(item => ({
			label: item.STND_C_NM,
			value: item.C_NO,
		}));

		setListCategory(CategoryConvert);
	};

	const remoteAsset = item => {
		var index = listUnScanAsset.findIndex(e => {
			return e?.AssetCode.trim() === item.trim();
		});
		listUnScanAsset.splice(index, 1);
	};
	useEffect(() => {
		if (listScanAsset.length > 0) {
			remoteAsset(listScanAsset[listScanAsset.length - 1]?.AssetCode);
		}
	}, [listScanAsset]);

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}
		>
			<View style={{ zIndex: 2 }}>
				<Header title="Asset Scan" />
			</View>

			{doneLoadAnimated && (
				<ScrollView style={{ flex: 1, padding: 8 }}>
					<Card style={{ padding: 8 }}>
						<View style={{ flexDirection: 'row', marginBottom: 8 }}>
							<PickerCustomComponent
								showLabel={true}
								listData={listWareHouse}
								label="Warehouse"
								value={warehouseSelected}
								style={{ flex: 1, marginRight: 8 }}
								textStyle={{ maxWidth: '100%' }}
								onValueChange={text => setWarehouseSelected(text)}
							/>

							<PickerCustomComponent
								showLabel={true}
								listData={listLocation}
								label="Location"
								value={locationSelected}
								style={{ flex: 1 }}
								textStyle={{ maxWidth: '100%' }}
								onValueChange={text => setLocationSelected(text)}
							/>
						</View>

						<PickerCustomComponent
							showLabel={true}
							listData={listCategory}
							label="Category"
							value={categorySelected}
							style={{ flex: 1 }}
							textStyle={{ maxWidth: '100%' }}
							onValueChange={text => setCategorySelected(text)}
						/>
					</Card>

					<View style={{ flexDirection: 'row', marginTop: 12 }}>
						<Button
							mode="contained"
							style={{
								flex: 1,
								marginRight: 8,
								backgroundColor: isStart ? 'red' : colors.primary,
							}}
							uppercase={false}
							onPress={() => {
								if (isStart) {
									if ((listScanAsset?.length || 0) < totalAsset) {
										Alert.alert(
											'Warning',
											`Inventory is missing ${
												totalAsset - listScanAsset?.length
											} assets, do you want to stop?`,
											[
												{ text: 'Cancel' },
												{
													text: 'Stop',
													style: 'destructive',
													onPress: () => {
														dispatch(clearListAssetScan());
														setIsStart(prevState => !prevState);

														setIsStop(prevState => !prevState);
													},
												},
											],
										);
									}
								} else {
									setIsStart(prevState => !prevState);
									if (isStop) {
										setIsStop(prevState => !prevState);
									}
								}
							}}
						>
							{isStart ? 'Stop' : 'Start'}
						</Button>
					</View>

					<View>
						{isStart && (
							<Text
								style={{
									marginTop: 16,
									marginBottom: 8,
									color: colors.primary,
									fontWeight: '600',
								}}
							>
								Assets Check:{' '}
								<Text style={{ color: Color.approved }}>
									{listScanAsset?.length || 0}/{totalAsset}
								</Text>
							</Text>
						)}

						{/* Asset đã được scan  */}
						{isStart && (
							<View style={{ alignItems: 'center', marginTop: 10 }}>
								<Text style={{ color: 'red', fontSize: 15 }}>
									Asset have scaned{' '}
								</Text>
							</View>
						)}

						{listScanAsset?.map((item, index) => (
							<Card key={index.toString()} style={{ marginTop: 8, padding: 8 }}>
								<View style={{ flexDirection: 'row', marginBottom: 8 }}>
									<TextInfoRow
										icon={'barcode-outline'}
										value={item?.AssetCode}
										styleValue={{ fontWeight: '600', color: Color.approved }}
									/>

									<TextInfoRow
										icon={'calendar-outline'}
										isIconRight
										value={moment(item?.Date).format('HH:MM DD/MM/YYYY')}
									/>
								</View>
								<TextInfoRow icon={'laptop-outline'} value={item?.AssetName} />
							</Card>
						))}

						{/* Nhưng Asset chưa được scan */}
						{isStop && (
							<View style={{ alignItems: 'center', marginTop: 10 }}>
								<Text style={{ color: 'red', fontSize: 15 }}>
									Asset haven't been scaned{' '}
								</Text>
							</View>
						)}

						{isStop &&
							listUnScanAsset?.map((item, index) => (
								<Card
									key={index.toString()}
									style={{ marginTop: 8, padding: 8 }}
								>
									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow
											icon={'barcode-outline'}
											value={item?.AssetCode}
											styleValue={{ fontWeight: '600', color: Color.approved }}
										/>

										<TextInfoRow
											icon={'calendar-outline'}
											isIconRight
											value={moment(item?.Date).format('HH:MM DD/MM/YYYY')}
										/>
									</View>
									<TextInfoRow
										icon={'laptop-outline'}
										value={item?.AssetName}
									/>
								</Card>
							))}
					</View>

					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>
			)}

			{isStart && (
				<SafeAreaView
					style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
				>
					<FAB
						icon="qrcode"
						onPress={() =>
							navigation.navigate('FixedAssetsCameraScreen', {
								locationSelected,
							})
						}
					/>
				</SafeAreaView>
			)}
		</KeyboardAvoidingView>
	);
}
