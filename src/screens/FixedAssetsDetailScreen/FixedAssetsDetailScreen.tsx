import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	View,
} from 'react-native';
import { Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { addListAssetScan } from '@actions/fixed_assets_action';
import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import {
	getFixedAssetDetail,
	getListLocationAssets,
	getListStatusAsset,
	updateStatusFixedAsset,
	getListAssetKeeper,
} from '@data/api';
import { IFixedAssetDetail, IUserSystem } from '@models/types';
interface IRouteParams {
	codeFixedAsset: string;
	locationSelected: string;
}

export function FixedAssetsDetailScreen(props) {
	const { codeFixedAsset, locationSelected }: IRouteParams = props.route.params;
	const navigation: any = useNavigation();
	const dispatch = useDispatch();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [fixedAssetItem, setFixedAssetItem] = useState<IFixedAssetDetail>();
	const [listStatus, setListStatus] = useState([]);
	const [listLocation, setListLocation] = useState<any[]>([]);
	const [statusSelected, setStatusSelected] = useState<string>();
	const [listAssetKeeper, setListAssetKeeper] = useState<any[]>([]);

	const [assetKeeper, setAssetKeeper] = useState('');
	console.log('====================================');
	console.log(fixedAssetItem,'ahihi');
	console.log('====================================');

	console.log(fixedAssetItem);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			try {
				await getDataLocation();
				const response: IFixedAssetDetail = (await getFixedAssetDetail({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					QRCode: codeFixedAsset,
				})) as IFixedAssetDetail;

				setFixedAssetItem(response);
				setStatusSelected(response.AssetStatus);
				setAssetKeeper(response?.employeeID);

				const responseStatus: any = await getListStatusAsset({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
				});
				const statusConvert = responseStatus.map(item => ({
					label: item.STND_C_NM,
					value: item.C_NO,
				}));

				setListStatus(statusConvert);

				const dataKeeper: any = await getListAssetKeeper({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
				});

				const dataKeeperConvert = dataKeeper.map(item => ({
					label: item.stnD_C_NM,
					value: item.c_NO,
				}));

				setListAssetKeeper(dataKeeperConvert);
			} catch (e: any) {
				Alert.alert('Error', e.message);
			}
			setDoneLoadAnimated(true);
		});
	}, []);

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

	const _onPressSave = async () => {
		// if (fixedAssetItem?.AssetLocation !== locationSelected) {
		//     Alert.alert("Warning","This asset is not belongs to your check list", [
		//         {text: "Save", onPress: async () => await saveAssets()},
		//         {text: "Cancel", style: "cancel"}
		//     ]);
		// } else {
		await saveAssets();
		dispatch(
			addListAssetScan({
				AssetCode: fixedAssetItem?.assetCode,
				AssetName: fixedAssetItem?.assetname,
				Date: new Date(),
			}),
		);
		// }
		navigation.goBack();
	};

	const saveAssets = async () => {
		try {
			await updateStatusFixedAsset({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				AssetCode: fixedAssetItem?.assetCode,
				AssetStatus: statusSelected,
				AssetKeeper: assetKeeper,
			});
		} catch (e: any) {
			Alert.alert('Error', e.message);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			style={{ flex: 1 }}
		>
			<View style={{ zIndex: 2 }}>
				<Header title="Asset Information" />
			</View>

			{doneLoadAnimated && (
				<ScrollView style={{ flex: 1, padding: 8 }}>
					<Card style={{ padding: 8 }}>
						<TextInputCustomComponent
							label="Asset Code"
							placeholder="Asset Code"
							style={{ marginBottom: 12 }}
							enable={false}
							value={fixedAssetItem?.assetCode}
						/>
						<View style={{ flexDirection: 'row', marginBottom: 12 }}>
							<TextInputCustomComponent
								label="Asset Category"
								placeholder="Asset Category"
								style={{ flex: 1 }}
								enable={false}
								value={`${fixedAssetItem?.AssetCategoryID} - ${fixedAssetItem?.assetcategoryname}`}
							/>
							<TextInputCustomComponent
								label="Asset Name"
								placeholder="Asset Name"
								style={{ flex: 1, marginLeft: 8 }}
								enable={false}
								value={fixedAssetItem?.assetname}
							/>
						</View>

						<TextInputCustomComponent
							label="Asset Name VN"
							placeholder="Asset Name VN"
							style={{ flex: 1, marginBottom: 12 }}
							enable={false}
							value={fixedAssetItem?.AssetName_VN}
						/>

						<View style={{ flexDirection: 'row' }}>
							{fixedAssetItem?.SerialNumber ? (
								<TextInputCustomComponent
									label="Serial No."
									placeholder="Serial No."
									style={{ flex: 1, marginRight: 8, marginBottom: 12 }}
									enable={false}
									value={fixedAssetItem?.SerialNumber}
								/>
							) : null}

							{fixedAssetItem?.Model ? (
								<TextInputCustomComponent
									label="Model"
									placeholder="Model"
									style={{ flex: 1, marginBottom: 12 }}
									enable={false}
									value={fixedAssetItem?.Model}
								/>
							) : null}
						</View>

						{fixedAssetItem?.Model ? (
							<TextInputCustomComponent
								label="Model"
								placeholder="Model"
								style={{ flex: 1, marginBottom: 12 }}
								enable={false}
								value={fixedAssetItem?.Model}
							/>
						) : null}

						<PickerCustomComponent
							showLabel={true}
							listData={listStatus}
							label="Status"
							value={statusSelected}
							style={{ flex: 1, height: '100%' }}
							textStyle={{ maxWidth: '100%' }}
							onValueChange={text => setStatusSelected(text)}
						/>
					</Card>

					<Card style={{ padding: 8, marginTop: 8 }}>
						<View style={{ flexDirection: 'row', marginBottom: 12 }}>
							<PickerCustomComponent
								showLabel={true}
								listData={[
									{
										label: fixedAssetItem?.BranchID1,
										value: fixedAssetItem?.BranchID1,
									},
								]}
								label="Branch"
								value={fixedAssetItem?.BranchID1}
								style={{ flex: 1, marginRight: 8, height: '100%' }}
								enable={false}
								textStyle={{}}
								onValueChange={text => null}
							/>
							<PickerCustomComponent
								showLabel={true}
								listData={[
									{
										label: fixedAssetItem?.AssetLocation,
										value: fixedAssetItem?.AssetLocation,
									},
								]}
								label="Location"
								value={fixedAssetItem?.AssetLocation}
								style={{ flex: 1, height: '100%' }}
								enable={false}
								textStyle={{}}
								onValueChange={text => null}
							/>
						</View>

						<View style={{ flexDirection: 'row', marginBottom: 12 }}>
							<TextInputCustomComponent
								label="Warehouse"
								placeholder="Warehouse"
								style={{ flex: 1 }}
								enable={false}
								value={`${fixedAssetItem?.ManagedWarehouseID} ${fixedAssetItem?.ManagedWarehouseID_NM}`}
							/>

							<TextInputCustomComponent
								label="Department"
								placeholder="Department"
								style={{ flex: 1, marginLeft: 8 }}
								enable={false}
								value={fixedAssetItem?.DeptpartmentID}
							/>
						</View>

						<TextInputCustomComponent
							label="Asset Manager Department"
							placeholder="Asset Manager Department"
							style={{ flex: 1, marginBottom: 12 }}
							enable={false}
							value={`${fixedAssetItem?.HRManagerID} - ${fixedAssetItem?.HRManagerID_NM}`}
						/>

						{/* <TextInputCustomComponent
							label="Asset Keeper"
							placeholder="Asset Keeper"
							style={{ flex: 1, marginBottom: 12 }}
							enable={false}
							value={`${fixedAssetItem?.EmployeeID} - ${fixedAssetItem?.EmployeeID_NM}`}
						/> */}
						<PickerCustomComponent
							showLabel={true}
							listData={listAssetKeeper}
							label="Asset Keeper"
							value={assetKeeper}
							style={{ flex: 1, height: '100%', marginBottom: 12 }}
							enable={true}
							textStyle={{}}
							onValueChange={text => setAssetKeeper(text)}
						/>

						<View style={{ flexDirection: 'row', marginBottom: 12 }}>
							<TextInputCustomComponent
								label="Unit"
								placeholder="Unit"
								style={{ flex: 1, marginRight: 8 }}
								enable={false}
								value={fixedAssetItem?.UnitID}
							/>

							<TextInputCustomComponent
								label="Kind of Item"
								placeholder="Kind of Item"
								style={{ flex: 1, marginLeft: 8 }}
								enable={false}
								value={fixedAssetItem?.Kind_FixedAsset}
							/>
						</View>
					</Card>

					<View style={{ flexDirection: 'row', marginTop: 12 }}>
						<Button
							mode="contained"
							style={{ flex: 1 }}
							uppercase={false}
							onPress={() => _onPressSave()}
						>
							{'Save'}
						</Button>
					</View>
					<SafeAreaView style={{ height: 60 }} />
				</ScrollView>
			)}
		</KeyboardAvoidingView>
	);
}
