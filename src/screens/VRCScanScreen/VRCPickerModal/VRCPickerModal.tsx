import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	View,
} from 'react-native';
import { Card, Searchbar, useTheme } from 'react-native-paper';
import { List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header';
import {
	getContractAssets,
	getContractListByUserID,
	getMortgageAssets,
} from '@data/api';
import { IContract, IUserSystem, IContactAsset } from '@models/types';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';

import styles from './styles';

export function VRCPickerModal(props) {
	const navigation: any = useNavigation();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const { title, getPicker, apnoOld, assetIDOld, isMortgageAsset } =
		props.route.params;
	const [listContract, setListContract] = useState<IContract[]>([]);
	const [asset, setAsset] = useState<IContactAsset[]>([]);
	const [mortgageAsset, setMortgageAsset] = useState<any[]>([]);
	const [expanded, setExpanded] = React.useState(true);
	const [expandedMort, setExpandedMort] = React.useState(true);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	/* Animation chạy xong thì call api lấy list hợp đồng về */
	useEffect(() => {
		(async function getDataContract() {
			const response = (await getContractListByUserID({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				deptCode: dataUserSystem.DEPT_CODE,
			})) as IContract[];
			setListContract(response);
		})();
	}, [doneLoadAnimated]);

	useEffect(() => {
		if (!apnoOld) return;
		(async function getDataContract() {
			const dataAsset = (await getContractAssets({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				APNO: apnoOld, //C211017612,
			})) as any[];
			setAsset(dataAsset);
		})();
	}, [doneLoadAnimated, apnoOld]);

	useEffect(() => {
		if (!apnoOld) return;
		(async function getDataContract() {
			const dataMortgageAsset = (await getMortgageAssets({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				APNO: apnoOld, // C211017612
			})) as any[];
			const dataConvert = dataMortgageAsset.map(item => ({
				...item,
				isMortgage: true,
				ASTS_NM: item.ASTS_NAME,
				ASTS_ID: item.SECU_SEQ,
			}));
			setMortgageAsset(dataConvert);
		})();
	}, [doneLoadAnimated, apnoOld]);

	// CHOOSE DATA NEED TO SEACRCH
	const getListContract = () => {
		const listContractNew = [...listContract];
		if (listContractNew.length > 0) {
			if (!apnoOld) {
				return listContract.filter(item => item.apno.includes(firstQuery));
			}
			const indexContractSelected = listContractNew.findIndex(
				item => item?.apno.trim() === apnoOld?.trim(),
			);
			const contractSelected = listContractNew[indexContractSelected];
			listContractNew.splice(indexContractSelected, 1);
			const tempData = [contractSelected || [], ...listContractNew];
			return tempData.filter(item => item.apno?.includes(firstQuery));
		}
		return [];
	};

	const getListAssets = () => {
		const listAssetNew = [...asset, ...mortgageAsset];
		if (listAssetNew.length > 0) {
			if (!assetIDOld) {
				return [
					{
						title: 'Leased Assets',
						data: listAssetNew.filter(
							item => !item.isMortgage && item.ASTS_NM?.includes(firstQuery),
						),
					},
					{
						title: 'Mortgaged Assets',
						data: listAssetNew.filter(
							item => item.isMortgage && item.ASTS_NM?.includes(firstQuery),
						),
					},
				];
			}
			const indexAssetSelected = listAssetNew.findIndex(
				item =>
					item?.ASTS_ID === assetIDOld && item?.isMortgage === isMortgageAsset,
			);
			const assetSelected = listAssetNew[indexAssetSelected];
			listAssetNew.splice(indexAssetSelected, 1);
			const tempData = [assetSelected || [], ...listAssetNew];

			return [
				{
					title: 'Leased Assets',
					data: tempData.filter(
						item => !item.isMortgage && item.ASTS_NM?.includes(firstQuery),
					),
				},
				{
					title: 'Mortgaged Assets',
					data: tempData.filter(
						item => item.isMortgage && item.ASTS_NM?.includes(firstQuery),
					),
				},
			];
		}
		return [];
	};

	const getTitleSearchBar = () => {
		switch (title) {
			case 'APNO':
				return 'Search...';
			case 'Asset':
				return 'Search..';
			default:
				return 'Search';
		}
	};

	const handlePress = titleFunction => {
		if (titleFunction === 'Mortgage Assets') {
			setExpandedMort(oldStatus => !oldStatus);
			return;
		}
		setExpanded(oldStatus => !oldStatus);
	};

	const backgroundColor = item => {
		switch (title) {
			case 'APNO':
				return item?.APNO?.trim() === apnoOld ? Color.backgroundAlpha : '#fff';
			case 'Asset':
				return item?.ASTS_ID === assetIDOld &&
					item?.isMortgage === isMortgageAsset
					? Color.backgroundAlpha
					: '#fff';
			default:
				return '#fff';
		}
	};

	const ContractListComponent = () => {
		return (
			<FlatList
				showsVerticalScrollIndicator={false}
				data={getListContract()}
				keyExtractor={(_, index) => index.toString()}
				style={{ paddingTop: 8, flex: 1 }}
				ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
				renderItem={({ item }) => {
					return (
						<View>
							<TouchableOpacity
								onPress={() => {
									getPicker(item);
									navigation.goBack();
								}}
							>
								<Card
									style={{
										marginTop: 5,
										backgroundColor: backgroundColor(item),
										marginHorizontal: 8,
										paddingVertical: 10,
									}}
								>
									<View style={{ paddingHorizontal: 8, flexDirection: 'row' }}>
										<TextInfoRow
											icon={'barcode-outline'}
											value={item.apno || 'No APNO'}
											styleValue={{
												flex: 1,
												color: colors.primary,
												fontWeight: '600',
											}}
										/>
										<TextInfoRow
											icon={'cash-outline'}
											isIconRight
											value={item.dep_amt || 'No APNO'}
											styleValue={{
												color: colors.primary,
												fontWeight: '600',
											}}
										/>
									</View>
								</Card>
							</TouchableOpacity>
						</View>
					);
				}}
			/>
		);
	};

	const AssetsListComponent = () => {
		return (
			<ScrollView>
				<List.Section title="Assets">
					{getListAssets().map((item, index) => (
						<List.Accordion
							key={index.toString()}
							title={item.title}
							expanded={
								item.title === 'Mortgaged Asset' ? expandedMort : expanded
							}
							onPress={() => handlePress(item.title)}
							left={propsIcon => (
								<List.Icon {...propsIcon} icon="monitor-multiple" />
							)}
						>
							{item.data.map((itemAsset, indexAssets) => (
								<List.Item
									key={indexAssets.toString()}
									title={`${itemAsset.ASTS_ID || 'No AssetID'}`}
									description={itemAsset.ASTS_NM}
									// titleStyle={{
									//     fontWeight: "600",
									// }}
									style={{ backgroundColor: backgroundColor(itemAsset) }}
									onPress={() => {
										getPicker(itemAsset);
										navigation.goBack();
									}}
								/>
							))}
						</List.Accordion>
					))}
				</List.Section>
			</ScrollView>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Picker Information'} />
			<View style={{ flex: 1 }}>
				<Searchbar
					textAlign={'left'}
					onChangeText={setFirstQuery}
					value={firstQuery}
					placeholder={getTitleSearchBar()}
					style={{ elevation: 2, marginTop: 8, marginHorizontal: 8, zIndex: 2 }}
					inputStyle={{ fontSize: 14 }}
				/>
				{title === 'APNO' ? <ContractListComponent /> : <AssetsListComponent />}
			</View>
		</View>
	);
}
