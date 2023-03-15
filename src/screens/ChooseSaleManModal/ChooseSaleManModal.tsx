import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	Keyboard,
	Platform,
	RefreshControl,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListCustomer } from '@actions/customer_action';
import AvatarBorder from '@components/AvatarBorder';

import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { ICustomer, IUserSystem } from '@models/types';
import styles from './styles';
import { getSaleMans } from '@data/api';

interface IPropsRouteParams {
	idSaleManSelected: string;
	dealerId: string;
	screenBack: string;
}

interface ISaleMan {
	salemaN_ID: string;
	salemaN_NM: string;
}

export function ChooseSaleManModal(props: any) {
	const dispatch = useDispatch();
	const navigation: any = useNavigation();
	const { idSaleManSelected, screenBack, dealerId }: IPropsRouteParams =
		props.route.params;
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [loadingData, setLoadingData] = useState<boolean>(false);
	const [listSaleMan, setListSaleMan] = useState<ISaleMan[]>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		getListDataSaleMan();
	}, [firstQuery, doneLoadAnimated]);

	const onRefresh = () => {
		getListDataSaleMan();
	};

	const getListDataSaleMan = async () => {
		setLoadingData(true);
		const responseSaleMan: any = await getSaleMans({
			userId: dataUserSystem.EMP_NO,
			dealerId,
		});
		setListSaleMan(responseSaleMan);
		setLoadingData(false);
	};

	const _onPressButtonClear = () => {
		navigation.navigate({
			name: screenBack,
			params: { salesmanSelected: {} },
			merge: true,
		});
	};

	const _onPressItem = (item: ISaleMan) => {
		navigation.navigate({
			name: screenBack,
			params: { salesmanSelected: item },
			merge: true,
		});
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
					Choose SaleMan
				</Text>
				<Button
					uppercase={false}
					style={{}}
					onPress={() => _onPressButtonClear()}
				>
					{'Clear'}
				</Button>
			</View>

			<Searchbar
				textAlign={'left'}
				placeholder={'Search Name or ID '}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{ zIndex: 2, marginHorizontal: 8, marginTop: 8 }}
				inputStyle={{ fontSize: 14 }}
			/>

			{/* View Body */}
			<View style={{ flex: 1, zIndex: 1 }}>
				<FlatList
					data={listSaleMan}
					extraData={idSaleManSelected}
					style={{ flex: 1, paddingTop: 8, backgroundColor: '#fff' }}
					keyExtractor={(_, index) => index.toString()}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							tintColor={colors.primary}
							colors={[colors.primary, Color.waiting, Color.approved]}
							refreshing={loadingData}
							onRefresh={onRefresh}
						/>
					}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => (
						<TouchableOpacity onPress={() => _onPressItem(item)}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									paddingHorizontal: 12,
									paddingVertical: 8,
									backgroundColor: '#fff',
									borderTopWidth: index === 0 ? 0 : 0.5,
									borderTopColor: '#ddd',
								}}
							>
								<AvatarBorder username={item.salemaN_ID} size={30} />
								<Text style={{ flex: 1, marginLeft: 12 }}>
									{item.salemaN_NM}
								</Text>
								{item.salemaN_ID === idSaleManSelected && (
									<Icon
										as={Ionicons}
										name="checkmark-outline"
										size={7}
										color={colors.primary}
									/>
								)}
							</View>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
}
