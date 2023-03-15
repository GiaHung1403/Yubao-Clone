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

interface IPropsRouteParams {
	idCustomerExisted: number;
	screenBack: string;
}

interface ICustomerReducer {
	listCustomer: ICustomer[];
	loading: boolean;
}

export function ChooseCustomerModal(props: any) {
	const dispatch = useDispatch();
	const navigation: any = useNavigation();
	const { idCustomerExisted, screenBack }: IPropsRouteParams =
		props.route.params;
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { listCustomer, loading }: ICustomerReducer = useSelector(
		(state: any) => state.customer_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [firstQuery, setFirstQuery] = useState('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		(async function search() {
			dispatch(
				getListCustomer({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: firstQuery,
				}),
			);
		})();
	}, [firstQuery, doneLoadAnimated]);

	const _onPressButtonClear = () => {
		navigation.navigate({
			name: screenBack,
			params: {
				customerSelected: {},
			},
			merge: true,
		});
	};

	// const _onPressItem = (item: ICustomer) => {
	//     navigation.navigate(screenBack, {customerSelected: item});
	// };

	const _onPressItem = (item: ICustomer) => {
		if (item.CHECK_LESEID === 1 || !item.OB) {
			Keyboard.dismiss();
			navigation.navigate({
				name: screenBack,
				params: {
					customerSelected: item.LESE_ID === idCustomerExisted ? {} : item,
				},
				merge: true,
			});

			return;
		}
		Alert.alert(
			'Alert',
			"You don't have permission to chat with this customer",
		);
	};

	const onRefresh = async () => {
		dispatch(
			getListCustomer({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				query: '',
			}),
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
					Choose Customer
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
				placeholder={'Search customer name or Taxcode '}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{ zIndex: 2, marginHorizontal: 8, marginTop: 8 }}
				inputStyle={{ fontSize: 14 }}
			/>

			{/* View Body */}
			<View style={{ flex: 1, zIndex: 1 }}>
				<FlatList
					data={listCustomer}
					extraData={idCustomerExisted}
					style={{ flex: 1, paddingTop: 8, backgroundColor: '#fff' }}
					keyExtractor={(_, index) => index.toString()}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							tintColor={colors.primary}
							colors={[colors.primary, Color.waiting, Color.approved]}
							refreshing={loading}
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
								<AvatarBorder username={item.LS_NM} size={30} />
								<Text style={{ flex: 1, marginLeft: 12 }}>
									{item.LESE_ID} - {item.LS_NM}
								</Text>
								{item.LESE_ID === idCustomerExisted && (
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
