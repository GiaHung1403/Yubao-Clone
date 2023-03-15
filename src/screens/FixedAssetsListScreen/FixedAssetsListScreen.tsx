import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, View } from 'react-native';
import { Button, Card, FAB, Searchbar } from 'react-native-paper';

import {
	clearListAssetScan,
	getListFixedAsset,
} from '@actions/fixed_assets_action';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { IFixedAsset, IUserSystem } from '@models/types';
import { convertUnixTimeDDMMYYYY } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

interface IFixedAssetsReducer {
	listFixedAsset: IFixedAsset[];
	loading: boolean;
}

export function FixedAssetsListScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { listFixedAsset, loading }: IFixedAssetsReducer = useSelector(
		(state: any) => state.fixed_assets_reducer,
	);
	const { listScanAsset } = useSelector(
		(state: any) => state.fixed_assets_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			dispatch(
				getListFixedAsset({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					AssetCode: '',
					LocationCode: '',
					BranchCode: dataUserSystem.BRANCH_CODE,
				}),
			);
			setDoneLoadAnimated(true);
		});
	}, []);

	const filterListSearch = () => {
		if (!searchText) {
			return listFixedAsset.slice(0, 50);
		}

		return listFixedAsset
			.filter(
				item =>
					item.assetname.includes(searchText) ||
					item.assetname.includes(searchText),
			)
			.slice(0, 50);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Fixed Assets List" />
			</View>

			<Searchbar
				placeholder={'Assets Code./Name'}
				value={searchText}
				inputStyle={{ fontSize: 14 }}
				style={{ marginTop: 8, marginHorizontal: 8, zIndex: 2 }}
				onChangeText={setSearchText}
			/>

			{doneLoadAnimated && !loading ? (
				<FlatList
					data={filterListSearch()}
					keyExtractor={(_, index) => index.toString()}
					style={{ paddingTop: 12, paddingHorizontal: 8 }}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item }) => (
						<Card
							elevation={2}
							style={{ marginBottom: 8 }}
							onPress={() => {
								navigation.navigate('FixedAssetsDetailScreen', {
									codeFixedAsset: item.assetCode,
								});
							}}
						>
							<View style={{ padding: 8 }}>
								<View style={{ flexDirection: 'row', marginBottom: 8 }}>
									<TextInfoRow
										icon={'barcode-outline'}
										value={item.assetCode}
										styleValue={{ fontWeight: '600', color: Color.approved }}
									/>

									<TextInfoRow
										icon={'calendar-outline'}
										isIconRight
										value={moment(new Date(item.crtd_datetime)).format(
											'DD/MM/YYYY',
										)}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginBottom: 8 }}>
									<TextInfoRow
										icon={'apps-outline'}
										value={item.assetcategoryname}
									/>

									<TextInfoRow
										icon={'laptop-outline'}
										isIconRight
										value={item.assetname}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginBottom: 8 }}>
									<TextInfoRow
										icon={'business-outline'}
										value={item.companyID}
									/>

									<TextInfoRow
										icon={'layers-outline'}
										isIconRight
										value={item.kind_fixedasset}
									/>
								</View>

								{/*<Button mode={"contained"} style={{ alignSelf: "flex-end" }} uppercase={false}>*/}
								{/*    Print*/}
								{/*</Button>*/}
							</View>
						</Card>
					)}
				/>
			) : (
				<LoadingFullScreen />
			)}
			<MyComponent />
		</View>
	);
}

const MyComponent = () => {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onStateChange = ({ open }) => setIsOpen(open);

	return (
		<FAB.Group
			visible={true}
			open={isOpen}
			icon={isOpen ? 'close' : 'menu'}
			actions={[
				// {icon: 'plus', label: 'New asset', onPress: () => navigation.navigate('FixedAssetsDetailScreen', {})},
				{
					icon: 'qrcode',
					label: 'QR Scan',
					onPress: () => {
						navigation.navigate('FixedAssetsCameraScreen', {
							locationSelected: '',
						});
					},
				},
				{
					icon: 'format-list-checks',
					label: 'Checking Assets',
					onPress: () => {
						dispatch(clearListAssetScan());
						navigation.navigate('FixedAssetsCheckingScreen', {});
					},
				},
				{
					icon: 'home-search-outline',
					label: 'In-stock Checking',
					onPress: () => navigation.navigate('FixedAssetsInstockScreen', {}),
				},
			]}
			onStateChange={onStateChange}
			onPress={() => {
				if (isOpen) {
					// do something if the speed dial is open
				}
			}}
		/>
	);
};
