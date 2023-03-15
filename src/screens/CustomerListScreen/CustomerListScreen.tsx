import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	Keyboard,
	RefreshControl,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { FAB, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	resetListDeptAmountUSD,
	resetListDeptAmountVND,
} from '@actions/contract_action';
import { getListCustomer } from '@actions/customer_action';
import FlatListWithHeaderCustom from '@components/FlatListWithHeaderCustom';
import Header from '@components/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { ICustomer, IUserSystem } from '@models/types';
import { removeVietnameseTones } from '@utils';
import CustomerItemComponent from './CustomerItemComponent';

interface ICustomerReducer {
	listCustomer: ICustomer[];
	loading: boolean;
}

const listFilterInstallApp = [
	{ label: 'All', value: '0' },
	{ label: 'Not Install App', value: '1' },
	{ label: 'Installed App', value: '2' },
];

export function CustomerListScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const route = useRoute();
	const dispatch = useDispatch();

	const { nameScreenBack, isSelectCustomerScreen }: any = route.params;
	const { listCustomer, loading }: ICustomerReducer = useSelector(
		(state: any) => state.customer_reducer,
	);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [filterInstallApp, setFilterInstallApp] = useState('0');

	const I18n = useContext(LocalizationContext);
	const textCustomerList = 'Customer List';
	const textSearch = 'Search by Name, TaxCode';

	const isVN = I18n.locale === 'vi';

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		(async function queryData() {
			dispatch(
				getListCustomer({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: removeVietnameseTones(firstQuery),
				}),
			);
		})();
	}, [firstQuery, doneLoadAnimated]);

	const onRefresh = async () => {
		dispatch(
			getListCustomer({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				query: removeVietnameseTones(firstQuery),
			}),
		);
	};

	const _onPressItem = (item: ICustomer) => {
		// console.log('====================================');
		// console.log(item);
		// console.log('====================================');
		if (
			item.CHECK_LESEID === 1 ||
			!item.OB ||
			dataUserSystem.DEPT_CODE === '1003' ||
			dataUserSystem.DEPT_CODE === '0013'
		) {
			if (isSelectCustomerScreen) {
				navigation.navigate(nameScreenBack, {
					customerInfo: item,
				});
				return null;
			}
			dispatch(resetListDeptAmountUSD());
			dispatch(resetListDeptAmountVND());
			Keyboard.dismiss();
			navigation.navigate('CustomerInfoScreen', {
				customerInfo: item,
			});

			return;
		}

		Alert.alert('Alert', "You don't have permission to view this information");
	};

	// const getListCustomerFilter = () => {
	//     switch (filterInstallApp) {
	//         case "0": return listCustomer;
	//         case "1": return listCustomer.filter(item => !item.LOGIN_APP);
	//         case "2": return listCustomer.filter(item => item.LOGIN_APP);
	//         default: return listCustomer;
	//     }
	// }

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={textCustomerList} />
			</View>

			<FlatListWithHeaderCustom
				loading={!doneLoadAnimated}
				data={listCustomer}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						tintColor={colors.primary}
						colors={[colors.primary, Color.waiting, Color.approved]}
						refreshing={loading}
						onRefresh={onRefresh}
					/>
				}
				HeaderOutList={() => (
					<Searchbar
						placeholder={textSearch}
						textAlign={'left'}
						onChangeText={query => setFirstQuery(query)}
						value={firstQuery}
						style={{ zIndex: 2 }}
						inputStyle={{ fontSize: 14 }}
					/>
				)}
				ListHeaderComponent={() => (
					<View style={{ flexDirection: 'row', marginBottom: 8 }}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: 20,
							}}
						>
							<View
								style={{
									width: 10,
									height: 10,
									borderRadius: 5,
									backgroundColor: 'red',
									marginRight: 8,
								}}
							/>
							<Text style={{ fontSize: 12, color: '#777' }}>
								Chưa thanh toán
							</Text>
						</View>

						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View
								style={{
									width: 10,
									height: 10,
									borderRadius: 5,
									backgroundColor: Color.approved,
									marginRight: 8,
								}}
							/>
							<Text style={{ fontSize: 12, color: '#777' }}>Đã thanh toán</Text>
						</View>
					</View>
				)}
				renderItem={({ item, index }) => (
					<CustomerItemComponent
						dataItem={item}
						onPressItem={() => _onPressItem(item)}
					/>
				)}
			/>
			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() =>
						navigation.navigate('CustomerNewScreen', {
							leseName: '',
							telephone: '',
							taxCodeRef: '',
							customerSource: '',
						})
					}
				/>
			</SafeAreaView>
		</View>
	);
}
