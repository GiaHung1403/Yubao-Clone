import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListCustomer } from '@actions/customer_action';
import Header from '@components/Header';
import { ICustomer, IUserSystem } from '@models/types';

interface ICustomerReducer {
	listCustomer: ICustomer;
	loading: boolean;
}

interface IPropRowFilter {
	onPressRowFilter: () => void;
	label: string;
	valueSelected: string;
	hasShowListData: boolean;
	listData?: any[];
	hasItemSelected: boolean;
	onPressItemData: (item: any) => void;
	hideBorderBottom?: boolean;
}

export function TakePhotoMainScreen(props: any) {
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	const renderRowFilter = ({
		onPressRowFilter,
		label,
		valueSelected,
		hasShowListData,
		listData,
		hasItemSelected,
		onPressItemData,
		hideBorderBottom,
	}: IPropRowFilter) => (
		<View>
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: '#fff',
					paddingHorizontal: 8,
					paddingVertical: 12,
					borderBottomColor: '#ddd',
					borderBottomWidth: hideBorderBottom || hasShowListData ? 0 : 1,
				}}
				onPress={onPressRowFilter}
			>
				<Text
					style={{
						flex: 1,
						color: '#555',
						fontWeight: '500',
					}}
				>
					{label}
				</Text>
				<Text
					style={{
						color: '#555',
						fontWeight: '500',
						marginRight: 8,
					}}
				>
					{valueSelected}
				</Text>
				<Icon
					as={Ionicons}
					name={
						hasShowListData ? 'chevron-down-outline' : 'chevron-forward-outline'
					}
					size={7}
					color={'#666'}
				/>
			</TouchableOpacity>
			{hasShowListData && (
				<View style={{ padding: 8 }}>
					<Searchbar
						textAlign={'left'}
						placeholder="Search"
						value=""
						style={{ elevation: 0 }}
						inputStyle={{ fontSize: 14 }}
					/>
					<FlatList
						data={listData}
						extraData={listData}
						style={{ maxHeight: 250 }}
						keyExtractor={(_, index) => index.toString()}
						renderItem={({ item, index }) => (
							<TouchableWithoutFeedback onPress={() => onPressItemData(item)}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										paddingHorizontal: 12,
										height: 45,
										backgroundColor: '#fff',
										borderTopWidth: 0.5,
										borderTopColor: '#ddd',
									}}
								>
									<Text style={{ flex: 1 }}>{item.EMPNM}</Text>
									{hasItemSelected && (
										<Icon
											as={Ionicons}
											name="checkmark-outline"
											size={7}
											color={colors.primary}
										/>
									)}
								</View>
							</TouchableWithoutFeedback>
						)}
					/>
				</View>
			)}
		</View>
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const { username, password }: any = await Keychain.getGenericPassword();
			dispatch(
				getListCustomer({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					query: '',
				}),
			);
			setDoneLoadAnimated(true);
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Header title="Take Photo" />

			{/* <View style={{ flex: 1 }}>
        {renderRowFilter({
          label: "Select Department",
          onPressRowFilter: () => setShowDepartment((oldStatus) => !oldStatus),
          valueSelected: "",
          hasShowListData: isShowDepartment,
          listData: listDepartment,
          hasItemSelected: false,
          onPressItemData: (item) => _onPressItemDepartment(item),
        })}
      </View> */}
		</View>
	);
}
