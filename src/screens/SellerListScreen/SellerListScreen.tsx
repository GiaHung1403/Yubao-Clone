import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	RefreshControl,
	SafeAreaView,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { Card, FAB, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListSeller } from '@actions/customer_action';
import Header from '@components/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { ISeller, IUserSystem } from '@models/types';
import { Ionicons } from '@expo/vector-icons';

interface ICustomerReducer {
	listSeller: ISeller[];
	loading: boolean;
}

interface IPropRowSellerItem {
	icon: string;
	isIconRight?: boolean;
	value: string;
	styleValue?: TextStyle;
	styleContainer?: ViewStyle;
	iconColor?: string;
}

const rowItemValue = ({
	icon,
	iconColor,
	isIconRight,
	value,
	styleValue,
	styleContainer,
}: IPropRowSellerItem) => (
	<View
		style={[
			{
				justifyContent: isIconRight ? 'flex-end' : 'flex-start',
				flexDirection: 'row',
				alignItems: 'center',
				flex: 1,
			},
			styleContainer,
		]}
	>
		{isIconRight || !icon ? null : (
			<Icon
				as={Ionicons}
				name={icon}
				size={6}
				color={iconColor || 'orange'}
				marginRight={4}
			/>
		)}
		<Text style={[styleValue, { flex: 1 }]}>{value}</Text>
		{isIconRight && icon ? (
			<Icon
				as={Ionicons}
				name={icon}
				size={6}
				color={iconColor || 'orange'}
				marginRight={4}
			/>
		) : null}
	</View>
);

export function SellerListScreen(props: any) {
	const navigation: any = useNavigation();
	const route = useRoute();
	const dispatch = useDispatch();

	const { colors } = useTheme();
	const { screenBack, idCustomerExisted }: any = route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { listSeller, loading }: ICustomerReducer = useSelector(
		(state: any) => state.customer_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');

	const I18n = useContext(LocalizationContext);
	const textSearch = 'Search by tax code and name';

	const isVN = I18n.locale === 'vi';

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(
				getListSeller({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
				}),
			);

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		if (firstQuery) {
			(async function queryData() {
				setDoneLoadAnimated(false);
				dispatch(
					getListSeller({
						User_ID: dataUserSystem.EMP_NO,
						Password: '',
						query: firstQuery,
					}),
				);

				setDoneLoadAnimated(true);
			})();
		}
	}, [firstQuery, doneLoadAnimated]);

	const onRefresh = async () => {
		dispatch(
			getListSeller({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				query: firstQuery,
				refresh: true,
			}),
		);
	};

	const _onPressItem = item => {
		if (idCustomerExisted) {
			navigation.navigate(screenBack, {
				customerSelected: item,
			});
			return null;
		}

		navigation.navigate('SellerInfoScreen', {
			sellerInfo: item,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Seller List'} />
			</View>

			<View style={{ flex: 1 }}>
				<Searchbar
					textAlign={'left'}
					placeholder={textSearch}
					onChangeText={query => setFirstQuery(query)}
					value={firstQuery}
					style={{ zIndex: 2, marginTop: 8, marginHorizontal: 8 }}
					inputStyle={{ fontSize: 14 }}
				/>
				{doneLoadAnimated && (
					<FlatList
						keyboardShouldPersistTaps="handled"
						style={{ paddingTop: 8 }}
						data={listSeller}
						keyExtractor={(_, index) => index.toString()}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={onRefresh}
							/>
						}
						ListFooterComponent={() => <SafeAreaView />}
						renderItem={({ item, index }) => (
							<Card
								style={{
									marginBottom: 8,
									marginHorizontal: 8,
									backgroundColor: '#fff',
								}}
							>
								<TouchableOpacity
									style={{
										flexDirection: 'row',
										padding: 8,
										alignItems: 'center',
									}}
									onPress={() => _onPressItem(item)}
								>
									<View style={{ marginLeft: 8, flex: 1 }}>
										{rowItemValue({
											icon: '',
											value: `${isVN ? item.SELLER_NM_V : item.SELLER_NM} - ${
												item.ID
											}`,
											styleValue: {
												marginRight: 24,
												fontWeight: '600',
												color: 'orange',
											},
											styleContainer: { marginBottom: 8 },
										})}

										{rowItemValue({
											icon: 'location-outline',
											value:
												(isVN ? item.ADDR_V : item.ADDR?.trim()) ||
												'No address yet',
											styleContainer: { marginBottom: 8 },
										})}

										<View style={{ flexDirection: 'row', marginBottom: 8 }}>
											{rowItemValue({
												icon: 'receipt-outline',
												value: item?.TAX_CODE || item?.REG_ID,
												styleContainer: { flex: 1 },
											})}

											{rowItemValue({
												icon: 'person-circle-outline',
												isIconRight: true,
												value: item.PIC,
												styleValue: { textAlign: 'right' },
											})}
										</View>
									</View>
								</TouchableOpacity>
							</Card>
						)}
					/>
				)}
			</View>

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() => {
						if (dataUserSystem.EMP_NO.includes('T')) {
							Alert.alert('Alert', 'Trading Function is coming soon!');
							return;
						}
						navigation.navigate('SellerNewScreen');
						// Alert.alert('Notice', 'Function under maintenance!');
					}}
				/>
			</SafeAreaView>
		</View>
	);
}
